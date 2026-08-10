const { run, script } = require('./npm_scripts_lib');

switch (script) {
  case 'setup:git':
    run(
      'git config --global submodule.recurse true',
      'git config --global core.autocrlf input',
      'git config --global fetch.prune true',
    );
    console.log('git properly configured');
    break;
  default:
    console.error('No script available');
}
