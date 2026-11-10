import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { runChecks } from '../scripts/check.mjs';
import { validRepo, write } from './helpers.mjs';

const rules = (root) => runChecks(root).problems.map((p) => p.rule);
const problem = (root, rule) => runChecks(root).problems.find((p) => p.rule === rule);

test('valid repo passes', () => {
  const r = runChecks(validRepo());
  assert.deepEqual(r.problems, []);
  assert.equal(r.ok, true);
});

test('skill-frontmatter: name must equal folder name', () => {
  const root = validRepo();
  write(root, '.agents/skills/setup/SKILL.md', '---\nname: other\ndescription: d\n---\n');
  assert.ok(rules(root).includes('skill-frontmatter'));
});
test('skill-frontmatter: description required', () => {
  const root = validRepo();
  write(root, '.agents/skills/setup/SKILL.md', '---\nname: setup\n---\n');
  assert.ok(rules(root).includes('skill-frontmatter'));
});
test('skill-frontmatter: description max 1024 chars', () => {
  const root = validRepo();
  write(root, '.agents/skills/setup/SKILL.md', `---\nname: setup\ndescription: ${'x'.repeat(1025)}\n---\n`);
  assert.ok(rules(root).includes('skill-frontmatter'));
});
test('skill-frontmatter: missing SKILL.md', () => {
  const root = validRepo();
  fs.rmSync(path.join(root, '.agents/skills/setup/SKILL.md'));
  assert.ok(rules(root).includes('skill-frontmatter'));
});

test('skill-link: missing .claude link', () => {
  const root = validRepo();
  fs.rmSync(path.join(root, '.claude/skills/setup'));
  assert.ok(rules(root).includes('skill-link'));
});
test('skill-link: plain file instead of symlink gives Windows fix-it message', () => {
  const root = validRepo();
  fs.rmSync(path.join(root, '.claude/skills/setup'));
  write(root, '.claude/skills/setup', '../../.agents/skills/setup');
  const p = problem(root, 'skill-link');
  assert.ok(p);
  assert.match(p.message, /git config core\.symlinks true/);
});
test('skill-link: wrong target', () => {
  const root = validRepo({ skills: ['setup', 'publish'] });
  fs.rmSync(path.join(root, '.claude/skills/setup'));
  fs.symlinkSync('../../.agents/skills/publish', path.join(root, '.claude/skills/setup'));
  assert.ok(rules(root).includes('skill-link'));
});
test('skill-link: orphan .claude link', () => {
  const root = validRepo();
  fs.symlinkSync('../../.agents/skills/gone', path.join(root, '.claude/skills/gone'));
  assert.ok(rules(root).includes('skill-link'));
});

test('claude-md: must contain @AGENTS.md line', () => {
  const root = validRepo();
  write(root, 'CLAUDE.md', 'see AGENTS.md\n');
  assert.ok(rules(root).includes('claude-md'));
});
test('agents-size: AGENTS.md must be under 32768 bytes', () => {
  const root = validRepo();
  write(root, 'AGENTS.md', 'x'.repeat(32768));
  assert.ok(rules(root).includes('agents-size'));
});
test('agents-size: missing AGENTS.md reported', () => {
  const root = validRepo();
  fs.rmSync(path.join(root, 'AGENTS.md'));
  assert.ok(rules(root).includes('agents-size'));
});

test('assets-dir: directory in wrangler.jsonc must exist', () => {
  const root = validRepo();
  write(root, 'wrangler.jsonc', '{ // c\n "assets": { "directory": "./dist" } }');
  assert.ok(rules(root).includes('assets-dir'));
});
test('assets-dir: URLs containing // inside strings are not treated as comments', () => {
  const root = validRepo();
  write(root, 'wrangler.jsonc', '{ "x": "https://a.b", "assets": { "directory": "./site" } }');
  assert.ok(!rules(root).includes('assets-dir'));
});

test('local-links: missing image is reported', () => {
  const root = validRepo();
  write(root, 'site/index.html', '<img src="images/missing.jpg">');
  assert.ok(rules(root).includes('local-links'));
});
test('local-links: missing page is reported', () => {
  const root = validRepo();
  write(root, 'site/index.html', '<a href="contact.html">c</a>');
  assert.ok(rules(root).includes('local-links'));
});
test('local-links: root-relative and query/hash links resolve', () => {
  const root = validRepo();
  write(root, 'site/index.html', '<a href="/about.html#x">a</a><img src="/images/a.jpg?v=2"><a href="//cdn.x/y">c</a><a href="tel:1">t</a>');
  assert.ok(!rules(root).includes('local-links'));
});
test('local-links: directory link resolves to index.html', () => {
  const root = validRepo();
  write(root, 'site/work/index.html', '<a href="../">home</a>');
  write(root, 'site/index.html', '<a href="work/">w</a>');
  assert.ok(!rules(root).includes('local-links'));
});

for (const [label, secret] of [
  ['GitHub classic token', 'ghp_' + 'a'.repeat(36)],
  ['GitHub fine-grained token', 'github_pat_' + 'A1_'.repeat(10)],
  ['private key', '-----BEGIN OPENSSH PRIVATE KEY-----'],
  ['OpenAI key', 'sk-' + 'b'.repeat(24)],
  ['Anthropic key', 'sk-ant-' + 'c'.repeat(24)],
  ['quoted password assignment', 'password = "hunter2hunter2xyz"'],
  ['API token assignment', 'API_TOKEN: \'abcdefghijklmnop\''],
]) {
  test(`secrets: detects ${label}`, () => {
    const root = validRepo();
    write(root, 'site/notes.txt', `hello ${secret} bye`);
    const p = problem(root, 'secrets');
    assert.ok(p, `expected secrets problem for ${label}`);
    assert.equal(p.file, 'site/notes.txt');
    assert.ok(!p.message.includes(secret), 'message must not echo the secret');
  });
}
test('secrets: prose mentioning tokens is fine', () => {
  const root = validRepo();
  write(root, 'docs/x.md', 'Never paste your password or API token into chat.');
  assert.ok(!rules(root).includes('secrets'));
});
test('secrets: skips .git, node_modules and tests', () => {
  const root = validRepo();
  const s = 'ghp_' + 'a'.repeat(36);
  write(root, '.git/config', s);
  write(root, 'node_modules/x/a.js', s);
  write(root, 'tests/fixture.txt', s);
  assert.ok(!rules(root).includes('secrets'));
});
