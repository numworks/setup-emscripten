const core = require('@actions/core')
const exec = require('@actions/exec')
const tc = require('@actions/tool-cache')
const fs = require('fs')
const os = require('os')
const path = require('path')
const process = require('process');

async function run() {
  try {
    const sdk = core.getInput('sdk')

    const cacheKey = 'emscripten'
    let emSdk = tc.find(cacheKey, sdk)

    if (emSdk && !sdk.includes('latest')) {
      core.info(`Using cached version ${sdk}`)
    } else {
      core.info(`Cloning emsdk from https://github.com/emscripten-core/emsdk.git`)
      await exec.exec('rm', ['-rf', 'emsdk'])
      await exec.exec('git', ['clone', 'https://github.com/emscripten-core/emsdk.git'])
      if (!sdk.includes('latest')) {
        let tag = sdk.split("-")[0]
        // fast-comp is not supported anymore on the main branch
        await process.chdir('emsdk');
        await exec.exec('git', ['checkout', tag])
        await process.chdir('..');
      }
      core.info(`Installing emsdk ${sdk}`)
      await exec.exec('./emsdk/emsdk', ['install', sdk])
      core.info(`Activating emsdk ${sdk}`)
      await exec.exec('./emsdk/emsdk', ['activate', sdk])
      core.info(`Caching version ${sdk}`)
      emSdk = await tc.cacheDir('emsdk', cacheKey, sdk)
    }

    core.exportVariable('EMSDK', emSdk)
    core.addPath(emSdk)
    const emConfPath = path.join(emSdk, '.emscripten')
    core.exportVariable('EM_CONFIG', emConfPath)
    const emConf = fs.readFileSync(emConfPath).toString()
    const emRoot = path.join(emSdk, emConf.match(/EMSCRIPTEN_ROOT = emsdk_path \+ '(.*)'/)[1])
    core.addPath(emRoot)
    const emNode = path.join(emSdk, emConf.match(/NODE_JS = emsdk_path \+ '(.*)'/)[1])
    core.exportVariable('EMSDK_NODE', emNode)
    core.addPath(path.dirname(emNode))
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
