#!/usr/bin/env node

const path = require('path');
const { URL } = require('url');
const { save } = require('./ofln');

const args = process.argv.splice(2).reduce((acc, cur, i, arr) => {
    cur.includes('-') ? acc[cur] = true
        : acc[arr[i - 1]] = cur;
    return acc;
}, {});

if (args['--help']) {
    console.log(
        '\nUsage: ofln [OPTIONS]\n' +
        '\nOptions:\n' +
        '  --help     Show this help message.\n' +
        '  --out      Relative path to the desired output dir.'
        + ' Will be created if needed.\n' +
        '  --target   Full link to the page to be saved.'
    );

    process.exit(1);
}

const out = path.resolve(args['--out']);
const target = new URL(args['--target']);

save({ out, target });
