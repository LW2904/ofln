const { inspect } = require('util');

const active = {
    level: process.env.LOG_LEVEL || 'info',
    modules: process.env.LOG_MODULES || '',
};

const write = (level, string) => {
    process.stdout.write(`${level} - ${string}\n`);
};

const log = (level, body, ...args) => {
    if (typeof body !== 'string') {
        write(level, inspect(body));

        return (args || []).forEach((e) => write(level, inspect(e)));
    }

    let index = 0;
    const string = body.replace(/%o/g, () => {
        return inspect(args[index++], {
            depth: null,
            colors: true,
            compact: true,
        });
    });

    write(level, string);
};

const levels = ['error', 'warn', 'info', 'debug'];

module.exports = (opts = {}) => {
    const { sub, silent } = Object.assign({
        sub: false,
        silent: false,
    }, opts);

    const logger = levels.reduce((acc, cur) => {
        const enabled = silent ? false : (
            levels.indexOf(active.level) >= levels.indexOf(cur)
                && sub ? active.modules.split().includes(sub) : true
        );

        acc[cur] = enabled
            ? (...args) => log(`${cur}${sub ? `:${sub}` : ''}`, ...args)
            : () => { };

        return acc;
    }, {});

    return logger;
};
