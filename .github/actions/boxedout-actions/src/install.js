const child_process = require('child_process');
const path = require('path');
const core = require('@actions/core');
const { env } = require('./defs');

const cwd = path.join(__dirname, '../../../../');

function runInstall() {
  const projectId = core.getInput('project-id');

  // then the workspace ones
  if (projectId) {
    child_process.execSync(
      `npm install --workspace apps/${projectId} --workspace libs/common --include-workspace-root`,
      { stdio: [0, 1, 2], cwd, env },
    );
  } else {
    // if not project id specified, install from every workspace
    child_process.execSync(
      `npm install --workspaces --include-workspace-root`,
      { stdio: [0, 1, 2], cwd, env },
    );
  }
}

module.exports = {
  runInstall,
};
