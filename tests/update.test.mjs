import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { applyTemplate } from '../scripts/update-from-template.mjs';
import { validRepo, write, skill } from './helpers.mjs';

const read = (root, rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (root, rel) => { try { fs.lstatSync(path.join(root, rel)); return true; } catch { return false; } };
const isLink = (root, rel) => fs.lstatSync(path.join(root, rel)).isSymbolicLink();

function pair() {
  const site = validRepo({ version: '0.1.0', skills: ['setup', 'old'] });
  const tpl = validRepo({ version: '0.2.0', skills: ['setup', 'fresh'] });
  return { site, tpl };
}

test('copies updated template-owned files', () => {
  const { site, tpl } = pair();
  write(tpl, 'AGENTS.md', '# New contract\n');
  const r = applyTemplate(site, tpl);
  assert.equal(read(site, 'AGENTS.md'), '# New contract\n');
  assert.ok(r.updated.includes('AGENTS.md'));
});

test('unchanged files are not reported as updated', () => {
  const { site, tpl } = pair();
  const r = applyTemplate(site, tpl);
  assert.ok(!r.updated.includes('CLAUDE.md'));
});

test('adds a new skill and its real symlink', () => {
  const { site, tpl } = pair();
  const r = applyTemplate(site, tpl);
  assert.ok(exists(site, '.agents/skills/fresh/SKILL.md'));
  assert.ok(isLink(site, '.claude/skills/fresh'));
  assert.equal(fs.readlinkSync(path.join(site, '.claude/skills/fresh')), '../../.agents/skills/fresh');
  assert.ok(r.added.includes('.agents/skills/fresh/SKILL.md'));
});

test('removes a skill the template dropped, including its link and folder', () => {
  const { site, tpl } = pair();
  const r = applyTemplate(site, tpl);
  assert.ok(!exists(site, '.agents/skills/old'));
  assert.ok(!exists(site, '.claude/skills/old'));
  assert.ok(r.removed.includes('.agents/skills/old/SKILL.md'));
  assert.ok(r.removed.includes('.claude/skills/old'));
});

test('never touches site-owned files even if the template has them', () => {
  const { site, tpl } = pair();
  write(site, 'SITE.md', 'my site');
  write(tpl, 'SITE.md', 'template placeholder');
  write(site, 'wrangler.jsonc', '{"name":"mine","assets":{"directory":"./site"}}');
  write(tpl, 'site/index.html', '<p>placeholder</p>');
  write(site, 'SETUP-PROGRESS.md', 'progress');
  write(site, 'package.json', '{"name":"mine"}');
  write(tpl, 'package.json', '{"name":"my-website"}');
  const before = ['SITE.md', 'wrangler.jsonc', 'site/index.html', 'SETUP-PROGRESS.md', 'package.json']
    .map((f) => [f, read(site, f)]);
  const r = applyTemplate(site, tpl);
  for (const [f, content] of before) assert.equal(read(site, f), content, `${f} changed`);
  for (const list of [r.added, r.updated, r.removed]) {
    assert.ok(!list.some((f) => f === 'SITE.md' || f.startsWith('site/')));
  }
});

test('replaces a plain-file pseudo-link (Windows checkout) with a real symlink', () => {
  const { site, tpl } = pair();
  fs.rmSync(path.join(site, '.claude/skills/setup'));
  write(site, '.claude/skills/setup', '../../.agents/skills/setup');
  applyTemplate(site, tpl);
  assert.ok(isLink(site, '.claude/skills/setup'));
});

test('template pseudo-links (zip extracted on Windows) still become real symlinks', () => {
  const { site, tpl } = pair();
  fs.rmSync(path.join(tpl, '.claude/skills/fresh'));
  write(tpl, '.claude/skills/fresh', '../../.agents/skills/fresh');
  applyTemplate(site, tpl);
  assert.ok(isLink(site, '.claude/skills/fresh'));
});

test('reports from and to versions', () => {
  const { site, tpl } = pair();
  const r = applyTemplate(site, tpl);
  assert.equal(r.from, '0.1.0');
  assert.equal(r.to, '0.2.0');
  assert.match(read(site, 'template-manifest.json'), /"0\.2\.0"/);
});

test('a new template-owned path in the new manifest is added', () => {
  const { site, tpl } = pair();
  const m = JSON.parse(read(tpl, 'template-manifest.json'));
  m.templateOwned.push('scripts/**');
  write(tpl, 'template-manifest.json', JSON.stringify(m));
  write(tpl, 'scripts/new-tool.mjs', '// new');
  const r = applyTemplate(site, tpl);
  assert.ok(r.added.includes('scripts/new-tool.mjs'));
});

test('missing template manifest throws naming template-manifest.json', () => {
  const { site, tpl } = pair();
  fs.rmSync(path.join(tpl, 'template-manifest.json'));
  assert.throws(() => applyTemplate(site, tpl), /template-manifest\.json/);
});

test('result passes the repo checks', async () => {
  const { runChecks } = await import('../scripts/check.mjs');
  const { site, tpl } = pair();
  applyTemplate(site, tpl);
  assert.deepEqual(runChecks(site).problems, []);
});

test('a file the template hands over to the site is kept, not deleted', () => {
  const { site, tpl } = pair();
  write(site, 'README.md', 'my readme');
  const m = JSON.parse(read(tpl, 'template-manifest.json'));
  m.templateOwned = m.templateOwned.filter((g) => g !== 'README.md');
  write(tpl, 'template-manifest.json', JSON.stringify(m));
  const r = applyTemplate(site, tpl);
  assert.equal(read(site, 'README.md'), 'my readme');
  assert.ok(!r.removed.includes('README.md'));
});
