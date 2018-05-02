<h3 align="center">ofln</h3>

Lightweight, fast, straightforward script to fatch a page and its resources, writing them to disk.

Uses streams throughout, and the very quick [parse5](https://github.com/inikulin/parse5) module to parse html.

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