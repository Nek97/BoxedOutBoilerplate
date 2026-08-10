const { execSync } = require('child_process');
const path = require('path');
const script = process.argv.slice(2);
console.log('script: ', script[0]);

const run = (...commands) =>
  commands.forEach((command) =>
    execSync(command, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '../'),
    }),
  );

module.exports = {
  run,
  script: script[0],
};
