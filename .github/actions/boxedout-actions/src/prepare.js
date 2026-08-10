const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const core = require('@actions/core');
const github = require('@actions/github');
const { env } = require('./defs');
const packageJson = require('../../../../package.json');

const projectId = core.getInput('project-id');

const projectPackageJson =
  projectId && fs.existsSync(`../../../../apps/${projectId}/package.json`)
    ? require(`../../../../apps/${projectId}/package.json`)
    : null;

const STAGE = {
  DEV: 'dev',
  QA: 'qa', // deprecated
  PROD: 'prod',
  // fallback for PRs and other branches
  OTHER: 'other',
};

const branchStagesMap = {
  dev: STAGE.DEV,
  rc: STAGE.QA, // deprecated
  master: STAGE.PROD,
};

const cwd = path.join(__dirname, '../../../../');

function runEnvironmentPreparation() {
  child_process.execSync(`npm run set:proj ${projectId}`, {
    stdio: [0, 1, 2],
    cwd,
    env,
  });
  // set jest workers for the pipeline due to limited available resources:
  // https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners#supported-runners-and-hardware-resources
  child_process.execSync(`npm config set jestworkers=2`, {
    stdio: [0, 1, 2],
    cwd,
    env,
  });
  /**@type {string} */
  const ref = github.context.payload.ref;
  //if (!ref) throw new Error('no ref available!');

  const branch = ref ? ref.replace('refs/heads/', '') : STAGE.OTHER;
  const branch_id = branch.split('/');
  /**@type {string} */
  const stage = branchStagesMap[branch] || STAGE.OTHER;
  core.setOutput('project_id', projectId);
  core.setOutput('github_stage', stage);
  core.setOutput('github_branch', branch.toLowerCase());
  core.setOutput('github_branch_id', branch_id[0].toLowerCase());

  // select the proper stage
  const ucStage = stage.toUpperCase();

  console.log(`Selecting ${ucStage} stage for the secrets`);

  const awsSetup = core.getBooleanInput('aws-setup');

  if (awsSetup) {
    const awsStage = stage === STAGE.OTHER ? 'DEV' : ucStage;

    const awsSecretKeyID = process.env[`AWS_SECRET_${awsStage}_KEY_ID`];
    const awsSecretKey = process.env[`AWS_SECRET_${awsStage}_KEY`];
    const awsAccountID = process.env[`AWS_ACCOUNT_${awsStage}_ID`];

    if (!awsSecretKey || !awsSecretKey || !awsAccountID)
      throw new Error(
        `One or more of the AWS secrets for the stage: ${ucStage} are missing`,
      );

    // set the required env variables for AWS
    core.exportVariable('AWS_SECRET_KEY_ID', awsSecretKeyID);
    core.exportVariable('AWS_SECRET_KEY', awsSecretKey);
    core.exportVariable('AWS_ACCOUNT_ID', awsAccountID);
    if (stage === STAGE.PROD) {
      core.exportVariable('AWS_REGION', 'eu-central-1');
    } else {
      core.exportVariable('AWS_REGION', 'eu-west-1');
    }
  }

  // set the DOCKER_ENV variable used during build
  core.exportVariable(
    'DOCKER_ENV',
    stage === STAGE.DEV ? 'development' : 'production',
  );

  core.exportVariable('STAGE', stage); // lowercase stage
  core.exportVariable('COMMIT_SHA', github.context.sha);

  core.exportVariable('CORE_API_VERSION', packageJson.version);

  // Export project specific version. E.g:
  // CLI_VERSION
  // MANAGE-PANEL_VERSION
  // USER-PROVIDER_VERSION
  // etc.
  if (projectPackageJson) {
    core.exportVariable(
      `${projectId.toUpperCase}_VERSION`,
      projectPackageJson.version,
    );
  }
}

module.exports = {
  runEnvironmentPreparation,
};
