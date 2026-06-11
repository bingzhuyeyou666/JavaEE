const { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } = require('node:fs');
const { join, resolve } = require('node:path');

const frontendDir = resolve(__dirname, '..');
const projectRoot = resolve(frontendDir, '..');
const source = resolve(projectRoot, 'src/main/resources/static/app');
const target = resolve(projectRoot, 'target/classes/static/app');

if (!existsSync(source)) {
  throw new Error(`Build output not found: ${source}`);
}

mkdirSync(resolve(projectRoot, 'target/classes/static'), { recursive: true });
rmSync(target, { recursive: true, force: true });

function copyDir(from, to) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from)) {
    const sourcePath = join(from, entry);
    const targetPath = join(to, entry);
    if (statSync(sourcePath).isDirectory()) {
      copyDir(sourcePath, targetPath);
    } else {
      copyFileSync(sourcePath, targetPath);
    }
  }
}

copyDir(source, target);

console.log(`Synced React app to ${target}`);
