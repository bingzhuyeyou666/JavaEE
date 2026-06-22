/**
 * 本文件负责将前端生产构建结果同步到 Spring Boot 静态资源目录
 */
const { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } = require('node:fs');
const { join, resolve } = require('node:path');

const frontendDir = resolve(__dirname, '..');
const projectRoot = resolve(frontendDir, '..');
const source = resolve(projectRoot, 'src/main/resources/static/app');
const target = resolve(projectRoot, 'target/classes/static/app');

if (!existsSync(source)) {
  throw new Error(`未找到前端构建结果：${source}`);
}

mkdirSync(resolve(projectRoot, 'target/classes/static'), { recursive: true });
rmSync(target, { recursive: true, force: true });

// 处理 copyDir 对应的用户操作
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
