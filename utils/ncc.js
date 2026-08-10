console.log(`Compiling ${process.argv[2]} into ${process.argv[3]}`);

const { execSync } = require('child_process');
const shell = (cmd) => execSync(cmd, { encoding: 'utf8', stdio: 'inherit' }); // shortcut
const path = require('path');

const externals = `--external='mysql2-import' --external='fastify-swagger' --external='microtime' --external='cacache'`;

/**
 * -s (sitemap)
 * -m (minify)
 * -C (skip cache)
 */
shell(
  `npx cross-env NODE_OPTIONS="--max-old-space-size=6000" ncc build ${path.join(
    process.cwd(),
    process.argv[2],
  )} ${externals} -t -m -C --v8-cache --license LICENSE -o ${path.join(
    process.cwd(),
    process.argv[3],
  )}`,
);
