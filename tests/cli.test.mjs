import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validRepo } from './helpers.mjs';

const scriptsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../scripts');

/** Run a script through a symlinked path, like macOS's /var -> /private/var temp folder. */
function runViaSymlink(script, args) {
  const link = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'aiwt-link-')), 'scripts');
  fs.symlinkSync(scriptsDir, link, process.platform === 'win32' ? 'junction' : 'dir');
  return spawnSync(process.execPath, [path.join(link, script), ...args], { encoding: 'utf8' });
}

test('check.mjs runs when started through a symlinked path', () => {
  const r = runViaSymlink('check.mjs', [validRepo()]);
  assert.match(r.stdout, /all checks passed/);
  assert.equal(r.status, 0);
});

test('update-from-template.mjs runs when started through a symlinked path', () => {
  const site = validRepo({ version: '0.1.0' });
  const tpl = validRepo({ version: '0.2.0' });
  const r = runViaSymlink('update-from-template.mjs', [tpl, site]);
  assert.match(r.stdout, /0\.1\.0 → 0\.2\.0/);
  assert.equal(r.status, 0);
});
