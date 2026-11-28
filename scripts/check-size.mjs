#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT_DIR = process.cwd();
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const MAX_REPO_BYTES = 1024 * 1024; // 1 MB (Strict)
const MAX_DIST_BYTES = 500 * 1024;  // 500 KB (Strict)

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getDirSize(dir) {
  if (!fs.existsSync(dir)) return 0;
  let total = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      total += getDirSize(fullPath);
    } else if (entry.isFile()) {
      total += fs.statSync(fullPath).size;
    }
  }
  return total;
}

function getTrackedRepoSize() {
  try {
    const stdout = execSync('git ls-files -z', { encoding: 'buffer' });
    const files = stdout.toString('utf8').split('\0').filter(Boolean);
    let total = 0;
    for (const f of files) {
      const p = path.join(ROOT_DIR, f);
      if (fs.existsSync(p)) {
        total += fs.statSync(p).size;
      }
    }
    return total;
  } catch (err) {
    console.warn('Could not run git ls-files, measuring untracked workspace excluding node_modules and .git');
    let total = 0;
    function walk(dir) {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.name === 'node_modules' || e.name === '.git' || e.name === 'dist') continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.isFile()) total += fs.statSync(p).size;
      }
    }
    walk(ROOT_DIR);
    return total;
  }
}

console.log('=== Vayu Hard Size Limit Audit ===');
const repoSize = getTrackedRepoSize();
const repoLimitPassed = repoSize < MAX_REPO_BYTES;
console.log(`Git-tracked Repo Size: ${formatBytes(repoSize)} / ${formatBytes(MAX_REPO_BYTES)} [${repoLimitPassed ? 'PASS' : 'FAIL'}]`);

let distLimitPassed = true;
if (fs.existsSync(DIST_DIR)) {
  const distSize = getDirSize(DIST_DIR);
  distLimitPassed = distSize < MAX_DIST_BYTES;
  console.log(`Production Dist Size: ${formatBytes(distSize)} / ${formatBytes(MAX_DIST_BYTES)} [${distLimitPassed ? 'PASS' : 'FAIL'}]`);
} else {
  console.log('Production Dist: Not built yet (run npm run build first)');
}

if (!repoLimitPassed || !distLimitPassed) {
  console.error('\nERROR: Hard size limit check failed!');
  process.exit(1);
} else {
  console.log('\nSUCCESS: All strict size constraints verified under limits.');
}
