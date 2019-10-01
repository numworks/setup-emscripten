# Setup emscripten

This is a GitHub action to setup an emscripten environment

In actions.yml:

```
steps:
  - uses: numworks/setup-emscripten@v1
  - run: source $EMSDK/emsdk_env.sh && emcc --version
```
