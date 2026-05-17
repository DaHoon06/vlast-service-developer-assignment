import { execSync } from 'child_process';
import { createHash } from 'crypto';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, extname } from 'path';

function walkDir(dir, exts, files = []) {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) walkDir(fullPath, exts, files);
    else if (exts.includes(extname(entry.name))) files.push(fullPath);
  }
  return files;
}

const CACHE_DIR = '.next/cache';
const CACHE_FILE = `${CACHE_DIR}/test-hash`;

const sourceFiles = walkDir('src', ['.ts', '.tsx']).sort();
const configFiles = ['jest.config.ts', 'jest.setup.ts', 'package.json'].filter(existsSync);

const hash = createHash('sha256');
for (const file of [...sourceFiles, ...configFiles]) {
  hash.update(readFileSync(file));
}
const currentHash = hash.digest('hex');

mkdirSync(CACHE_DIR, { recursive: true });

const storedHash = existsSync(CACHE_FILE) ? readFileSync(CACHE_FILE, 'utf-8').trim() : '';

if (storedHash === currentHash) {
  console.log('✓ Tests skipped (no changes detected)');
} else {
  console.log('Running tests...');
  execSync('pnpm test:ci', { stdio: 'inherit' });
  writeFileSync(CACHE_FILE, currentHash);
}

execSync('pnpm build', { stdio: 'inherit' });
