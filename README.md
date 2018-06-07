<h3 align="center">ofln</h3>

Lightweight, fast, straightforward script to fetch a page and its resources, writing them to disk.

Uses streams throughout and the very quick [parse5](https://github.com/inikulin/parse5) module to parse html, which is the only dependency.

```
$ npm i -g @sturmwalzer/ofln
$ ofln --help
```

```
Usage: ofln [OPTIONS]

Options:
  --help     Show this help message.
  --out      Relative path to the desired output dir. Will be created if needed.
  --target   Full link to the page to be saved.
```

Optionally usage as a module is also possible:

```javascript
const { resolve } = require('path');
const { save } = require('@sturmwalzer/ofln');

save('https://www.fsf.org', { out: resolve('./fsf/') });

// ...or: 

save({
    out: resolve('./fsf/'),
    target: 'https://www.fsf.org',
})
```

Note that the API is slightly different in the module version, as the out path is expected to be an absolute one.
