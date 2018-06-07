const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { get } = require('./lib/request');
const { parse } = require('./lib/parse');
const { warn, debug } = require('./lib/log')({
    silent: !!module.parent,
});

/**
 * Execute all Promises in an array concurrently and resolve with the data
 * and errors.
 */
const executeAll = (promises) => new Promise((resolve) => {
    let errors = [];
    let resolved = [];

    function cb(err, data = true) {
        if (err) { errors.push(err); } else resolved.push(data);

        if ((resolved.length + errors.length) === promises.length) {
            resolve({ resolved, errors });
        }
    }

    for (const promise of promises) {
        promise.then((data) => cb(null, data)).catch(cb);
    }
});

/**
 * Pipe an origin stream into an internally created read stream pointed at
 * the given absolute path. Missing path segments will be created.
 */
const pipeToFile = (origin, destination) => {
    path.parse(destination).dir.split(path.sep)
        .map((e, i, a) => path.join(path.sep, ...a.slice(0, a.length - i)))
        .reverse().forEach((sub) => !fs.existsSync(sub) && fs.mkdirSync(sub));

    origin.pipe(fs.createWriteStream(destination));
};

/**
 * Process a link node, saving it to disk if it's a resource we want.
 */
const processLink = async (node, opts) => {
    const { attrs } = node;
    const { out, target } = opts;

    if (!attrs.href) { return; }

    const url = new URL(attrs.href, target);

    debug('processing link node %o', url.href);

    if (attrs.rel.includes('icon') || attrs.rel.includes('stylesheet')) {
        const dest = path.join(out, url.pathname);

        debug('piping from %o to %o',
            url.hostname + url.pathname, path.relative(__dirname, dest));

        pipeToFile(await get(url, { stream: true }), dest);

        return { dest, href: attrs.href };
    }
};

/**
 * Process a page and its relevant nodes.
 */
const processPage = async (html, opts) => {
    const document = parse(html);

    const links = [];
    const { out } = opts;

    for (const link of document.getNode('head').getNodes('link')) {
        delete link.parentNode;
        delete link.namespaceURI;

        links.push(processLink(link, opts));
    }

    const { resolved, errors } = await executeAll(links);

    debug('successfully processed %o links, failed to process %o links',
        resolved.length, errors.length);

    if (errors.length) {
        warn('failed to process %o links', errors.length);

        errors.forEach(debug);
    }

    for (const link of resolved) {
        if (link.dest && link.href) {
            const rel = path.relative(out, link.dest);

            html.replace(link.href, rel);
            debug('replaced %o with %o', link.href, rel);
        }
    }

    fs.writeFileSync(path.join(out, 'index.html'), html);
};

exports.save = (opts) => {
    const options = Object.assign({
        out: path.resolve('.'),
        target: 'https://www.fsf.org/',
    }, opts);

    get(options.target)
        .then(((html) => processPage(html, options)).catch(warn));
};
