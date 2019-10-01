const core = require('@actions/core');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');

const tempDirectory = process.env['RUNNER_TEMP'] || '';

async function run() {
  try {
    await exec.exec('git', ['clone', 'https://github.com/emscripten-core/emsdk.git'])
    const cachedPath = await tc.cacheDir('emsdk', 'emscripten', 'latest');
    core.addPath(cachedPath);
    core.exportVariable('EMSDK', cachedPath);
    await exec.exec('emsdk', ['install', 'latest'])
    await exec.exec('emsdk', ['activate', 'latest'])
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
