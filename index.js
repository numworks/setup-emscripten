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

    await exec.exec('echo', ['"EMSDK=' + emSdk + '"', '>>', '$GITHUB_ENV'])
    await exec.exec('echo', [emSdk, '>>', '$GITHUB_PATH'])
    await exec.exec('echo', ['$GITHUB_PATH'])


    await exec.exec('emsdk', ['install', sdk])
    await exec.exec('emsdk', ['activate', sdk])

    const emConfPath = path.join(emSdk, '.emscripten')
    await exec.exec('echo', ['"EM_CONFIG=' + emConfPath + '"', '>>', '$GITHUB_ENV'])
    const emConf = fs.readFileSync(emConfPath).toString()
    const emRoot = path.join(emSdk, emConf.match(/EMSCRIPTEN_ROOT = emsdk_path \+ '(.*)'/)[1])
    await exec.exec('echo', [emRoot, '>>', '$GITHUB_PATH'])
    const emNode = path.join(emSdk, emConf.match(/NODE_JS = emsdk_path \+ '(.*)'/)[1])
    await exec.exec('echo', ['"EMSDK_NODE=' + emNode + '"', '>>', '$GITHUB_ENV'])
    await exec.exec('echo', [path.dirname(emNode), '>>', '$GITHUB_PATH'])
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()
