import test from 'node:test';
import assert from 'node:assert/strict';
import { matchesAny, loadManifest } from '../scripts/lib/manifest.mjs';
import { validRepo, write } from './helpers.mjs';

test('** matches nested paths', () => {
  assert.equal(matchesAny('.agents/skills/setup/SKILL.md', ['.agents/skills/**']), true);
});
test('non-matching prefix does not match', () => {
  assert.equal(matchesAny('site/index.html', ['.agents/skills/**']), false);
});
test('* matches within one segment only', () => {
  assert.equal(matchesAny('docs/a.md', ['docs/*.md']), true);
  assert.equal(matchesAny('docs/x/a.md', ['docs/*.md']), false);
});
test('exact path matches', () => {
  assert.equal(matchesAny('AGENTS.md', ['AGENTS.md']), true);
  assert.equal(matchesAny('xAGENTS.md', ['AGENTS.md']), false);
});
test('dots in globs are literal', () => {
  assert.equal(matchesAny('AGENTSxmd', ['AGENTS.md']), false);
});
test('** also matches the directory entry itself', () => {
  assert.equal(matchesAny('.claude/skills/setup', ['.claude/skills/**']), true);
});
test('loadManifest reads version and templateOwned', () => {
  const root = validRepo({ version: '1.2.3' });
  const m = loadManifest(root);
  assert.equal(m.version, '1.2.3');
  assert.ok(m.templateOwned.includes('AGENTS.md'));
});
test('loadManifest throws a message naming the file when missing', () => {
  const root = validRepo();
  write(root, 'template-manifest.json', '');
  assert.throws(() => loadManifest(root + '/nope'), /template-manifest\.json/);
});
