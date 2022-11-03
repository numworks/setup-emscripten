# Setup emscripten

This is a GitHub action to setup an emscripten environment.
You can optionally specify which sdk you want to install.

In actions.yml:

```
steps:
  - uses: numworks/setup-emscripten@v1
    with:
      sdk: latest-fastcomp
  - run: emcc --version
```

## How to update this action

- Before merging a PR to the master branch, make sure you removed the `node_modules` directory and ran `npm install`.
- Once CI is passing, update the "latest" tag.
