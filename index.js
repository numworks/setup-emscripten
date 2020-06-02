const core = require('@actions/core')
const exec = require('@actions/exec')
const tc = require('@actions/tool-cache')
const fs = require('fs')
const os = require('os')
const path = require('path')

async function run() {
  try {
    const sdk = core.getInput('sdk')
    await exec.exec('git', ['clone', 'https://github.com/emscripten-core/emsdk.git'])
    const emSdk = await tc.cacheDir('emsdk', 'emscripten', 'latest');

    core.exportVariable('EMSDK', emSdk)
    core.addPath(emSdk)

    await exec.exec('emsdk', ['install', sdk])
    await exec.exec('emsdk', ['activate', sdk])

    const emConfPath = path.join(emSdk, '.emscripten')
    core.exportVariable('EM_CONFIG', emConfPath)
    const emConf = fs.readFileSync(emConfPath).toString()
    const emRoot = path.join(emSdk, emConf.match(/EMSCRIPTEN_ROOT = emsdk_path \+ '(.*)'/)[1])
    core.addPath(emRoot)
    const emNode = path.join(emSdk, emConf.match(/NODE_JS = emsdk_path \+ '(.*)'/)[1])
    core.exportVariable('EMSDK_NODE', emNode)
    core.addPath(path.dirname(emNode))
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()
