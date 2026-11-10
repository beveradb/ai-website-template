#!/usr/bin/env node
// Validates a site repo built from ai-website-template.
// Usage: node scripts/check.mjs [repoDir]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { walk } from './lib/manifest.mjs';

const SKILLS = '.agents/skills';
const LINKS = '.claude/skills';
const AGENTS_MAX_BYTES = 32768;
const BINARY = /\.(png|jpe?g|gif|webp|avif|ico|svg|pdf|zip|gz|woff2?|ttf|otf|mp4|mov|webm|mp3)$/i;
const SKIP_DIRS = ['.git', 'node_modules', '.superpowers', '.wrangler'];
const SKIP_PATHS = ['tests']; // the template's own test fixtures, top level only

const SECRET_PATTERNS = [
  ['GitHub token', /gh[pousr]_[A-Za-z0-9]{36}/],
  ['GitHub token', /github_pat_[A-Za-z0-9_]{22,}/],
  ['private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['API key', /sk-ant-[A-Za-z0-9-]{20,}/],
  ['API key', /sk-[A-Za-z0-9]{20,}/],
  ['password or token', /(api[_-]?token|secret|password)\s*[:=]\s*['"][^'"\s]{12,}/i],
  ['password or token', /^\s*(?:export\s+)?[A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|API_KEY)[A-Z0-9_]*\s*=\s*[^\s'"]{12,}/m],
];

const dirs = (abs) =>
  fs.existsSync(abs) ? fs.readdirSync(abs, { withFileTypes: true }) : [];

function checkSkills(root) {
  const problems = [];
  for (const d of dirs(path.join(root, SKILLS)).filter((e) => e.isDirectory())) {
    const file = `${SKILLS}/${d.name}/SKILL.md`;
    const bad = (message) => problems.push({ rule: 'skill-frontmatter', file, message });
    const abs = path.join(root, file);
    if (!fs.existsSync(abs)) { bad('SKILL.md is missing'); continue; }
    const m = fs.readFileSync(abs, 'utf8').match(/^---\n([\s\S]*?)\n---/);
    if (!m) { bad('missing --- frontmatter block'); continue; }
    const fields = Object.fromEntries(
      m[1].split('\n').map((l) => l.match(/^([a-z-]+):\s*(.*)$/)).filter(Boolean).map((x) => [x[1], x[2].trim()]),
    );
    if (fields.name !== d.name) bad(`frontmatter name "${fields.name ?? ''}" must equal folder name "${d.name}"`);
    if (!fields.description) bad('frontmatter description is required');
    else if (fields.description.length > 1024) bad('description must be at most 1024 characters');
  }
  return problems;
}

function checkSkillLinks(root) {
  const problems = [];
  const bad = (name, message) => problems.push({ rule: 'skill-link', file: `${LINKS}/${name}`, message });
  const skills = dirs(path.join(root, SKILLS)).filter((e) => e.isDirectory()).map((e) => e.name);
  for (const name of skills) {
    const abs = path.join(root, LINKS, name);
    const want = `../../${SKILLS}/${name}`;
    let st;
    try { st = fs.lstatSync(abs); } catch { bad(name, `missing; create it with: ln -s ${want} ${LINKS}/${name}`); continue; }
    if (!st.isSymbolicLink()) {
      problems.push({
        rule: 'skill-link', file: `${LINKS}/${name}`, warning: true,
        message: 'is a plain file, not a link (this happens on Windows). Skills still work: read them from '
          + `${SKILLS}/${name}/SKILL.md. To fix properly, turn on Windows Developer Mode, run `
          + '"git config core.symlinks true", then run the update-from-template skill.',
      });
    } else if (fs.readlinkSync(abs) !== want) {
      bad(name, `points to "${fs.readlinkSync(abs)}" but should point to "${want}"`);
    }
  }
  for (const e of dirs(path.join(root, LINKS))) {
    if (!skills.includes(e.name)) bad(e.name, `has no matching skill in ${SKILLS}/; delete it`);
  }
  return problems;
}

function checkClaudeMd(root) {
  const abs = path.join(root, 'CLAUDE.md');
  const ok = fs.existsSync(abs) && fs.readFileSync(abs, 'utf8').split(/\r?\n/).some((l) => l.trim() === '@AGENTS.md');
  return ok ? [] : [{ rule: 'claude-md', file: 'CLAUDE.md', message: 'must contain a line "@AGENTS.md" so Claude reads the shared instructions' }];
}

function checkAgentsSize(root) {
  const abs = path.join(root, 'AGENTS.md');
  if (!fs.existsSync(abs)) return [{ rule: 'agents-size', file: 'AGENTS.md', message: 'AGENTS.md is missing' }];
  const size = fs.statSync(abs).size;
  return size < AGENTS_MAX_BYTES ? [] : [{
    rule: 'agents-size', file: 'AGENTS.md',
    message: `is ${size} bytes; Codex only reads the first ${AGENTS_MAX_BYTES}. Move detail into skills.`,
  }];
}

/** Strip // and /* *\/ comments outside of strings, so JSONC can be JSON.parsed. */
export function stripJsonComments(text) {
  let out = '', inStr = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (inStr) {
      out += c;
      if (c === '\\') { out += n; i++; } else if (c === '"') inStr = false;
    } else if (c === '"') { inStr = true; out += c; }
    else if (c === '/' && n === '/') { while (i < text.length && text[i] !== '\n') i++; out += '\n'; }
    else if (c === '/' && n === '*') { i += 2; while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i++; i++; }
    else out += c;
  }
  return out.replace(/,(\s*[}\]])/g, '$1');
}

export function assetsDir(root) {
  const abs = path.join(root, 'wrangler.jsonc');
  if (!fs.existsSync(abs)) return null;
  const cfg = JSON.parse(stripJsonComments(fs.readFileSync(abs, 'utf8')));
  return cfg.assets?.directory ?? null;
}

function checkAssetsDir(root) {
  const bad = (message) => [{ rule: 'assets-dir', file: 'wrangler.jsonc', message }];
  let dir;
  try { dir = assetsDir(root); } catch (err) { return bad(`could not be parsed: ${err.message}`); }
  if (dir === null) return bad('missing, or has no "assets.directory"');
  return fs.existsSync(path.join(root, dir)) ? [] : bad(`assets.directory "${dir}" does not exist`);
}

function checkLocalLinks(root) {
  let dir;
  try { dir = assetsDir(root); } catch { return []; }
  if (!dir || !fs.existsSync(path.join(root, dir))) return [];
  const siteRoot = path.join(root, dir);
  const problems = [];
  for (const rel of walk(siteRoot).filter((f) => f.endsWith('.html'))) {
    const html = fs.readFileSync(path.join(siteRoot, rel), 'utf8');
    for (const [, ref] of html.matchAll(/\s(?:href|src)\s*=\s*["']([^"']*)["']/gi)) {
      if (!ref || /^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(ref)) continue;
      const clean = decodeURIComponent(ref.split(/[?#]/)[0]);
      if (!clean) continue;
      let target = clean.startsWith('/')
        ? path.join(siteRoot, clean)
        : path.join(siteRoot, path.dirname(rel), clean);
      if (clean.endsWith('/') || (fs.existsSync(target) && fs.statSync(target).isDirectory())) {
        target = path.join(target, 'index.html');
      }
      if (!fs.existsSync(target)) {
        problems.push({ rule: 'local-links', file: `${dir.replace(/^\.\//, '')}/${rel}`, message: `links to "${ref}", which does not exist` });
      }
    }
  }
  return problems;
}

function checkSecrets(root) {
  const problems = [];
  for (const rel of walk(root, { skip: SKIP_DIRS, skipPaths: SKIP_PATHS })) {
    if (BINARY.test(rel)) continue;
    const abs = path.join(root, rel);
    if (fs.lstatSync(abs).isSymbolicLink()) continue;
    const text = fs.readFileSync(abs, 'utf8');
    for (const [label, re] of SECRET_PATTERNS) {
      if (re.test(text)) {
        problems.push({ rule: 'secrets', file: rel, message: `looks like it contains a ${label}. Remove it — secrets must never be saved in the site.` });
        break;
      }
    }
  }
  return problems;
}

export function runChecks(rootDir) {
  const problems = [
    ...checkSkills(rootDir), ...checkSkillLinks(rootDir), ...checkClaudeMd(rootDir),
    ...checkAgentsSize(rootDir), ...checkAssetsDir(rootDir), ...checkLocalLinks(rootDir),
    ...checkSecrets(rootDir),
  ];
  return {
    ok: problems.every((p) => p.warning),
    problems: problems.filter((p) => !p.warning),
    warnings: problems.filter((p) => p.warning),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { ok, problems, warnings } = runChecks(path.resolve(process.argv[2] ?? '.'));
  for (const w of warnings) console.log(`! ${w.file}: ${w.message}`);
  for (const p of problems) console.log(`✗ ${p.file}: ${p.message}`);
  if (ok) console.log('✓ all checks passed');
  process.exit(ok ? 0 : 1);
}
