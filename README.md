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

 - Push a new commit with your changes on the `master` branch
 - Checkout the `v1` branch
 - Rebase `v1` on the top of the `master` branch
 - Remove the `node_modules` directory
 - Run `npm install` and add the `node_modules` folder to the repository by amending the last commit "Add prod dependencies"
 - Force push the `v1` branch to GitHub
