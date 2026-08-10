const path = require('path');
const child_process = require('child_process');
const { step } = require('./src/helpers');
const { NPM_GLOBAL_DIR, NPM_VERSION, env } = require('./src/defs');

const cwd = path.join(__dirname, '../../../');

/**
 * Installing action dependencies before executing any actions
 */

step('NPM Dir change', () => {
  child_process.execSync(`mkdir -p ${NPM_GLOBAL_DIR}`, {
    stdio: [0, 1, 2],
    cwd,
  });
  child_process.execSync(`npm config set prefix '${NPM_GLOBAL_DIR}'`, {
    stdio: [0, 1, 2],
    cwd,
  });
  child_process.execSync(`echo "${NPM_GLOBAL_DIR}/bin" >> $GITHUB_PATH`);
});

step('NPM7 install', () => {
  child_process.execSync(`npm install -g npm@${NPM_VERSION}`, {
    stdio: [0, 1, 2],
    cwd,
  });
});

// make sure that node_modules are installed
step('Npm action modules install', () => {
  child_process.execSync('npm install', {
    stdio: [0, 1, 2],
    cwd: __dirname,
    env,
  });
});

// now we can require the action modules
const { runInstall } = require('./src/install');
const { runEnvironmentPreparation } = require('./src/prepare.js');
const { npmVersionCheck } = require('./src/utils');
const core = require('@actions/core');
// set new npm dir in pipeline paths
core.addPath(`${NPM_GLOBAL_DIR}/bin`);

/**
 *
 * @param {Error} error
 */
function setFailed(error) {
  console.log(error.message, error.stack);
  core.setFailed(error.message);
}

// most @actions toolkit packages have async methods
async function run() {
  try {
    await npmVersionCheck();

    step('Prepare env', runEnvironmentPreparation);

    const canInstall = core.getBooleanInput('run-install');
    if (canInstall === true) {
      console.log('Run installation process');

      step('Install project node_modules', runInstall);
    }
  } catch (error) {
    setFailed(error);
  }
}

run();
