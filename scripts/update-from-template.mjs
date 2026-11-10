#!/usr/bin/env node
// Applies a newer copy of the template's own files to this site.
// Usage: node scripts/update-from-template.mjs <extractedTemplateDir> [siteDir]
// Only files listed as template-owned (in either manifest) are touched; site files are never changed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadManifest, matchesAny, walk } from './lib/manifest.mjs';

const SKIP = ['.git', 'node_modules', '.superpowers', '.wrangler'];
const LINK_DIR = '.claude/skills/';
const isSkillLink = (rel) => rel.startsWith(LINK_DIR) && !rel.slice(LINK_DIR.length).includes('/');
const linkTarget = (rel) => `../../.agents/skills/${rel.slice(LINK_DIR.length)}`;

function readEntry(abs) {
  const st = fs.lstatSync(abs, { throwIfNoEntry: false });
  if (!st) return null;
  return st.isSymbolicLink() ? `link:${fs.readlinkSync(abs)}` : fs.readFileSync(abs);
}

function same(a, b) {
  if (a === null || b === null) return false;
  if (typeof a === 'string' || typeof b === 'string') return a === b;
  return a.equals(b);
}

function removeEmptyParents(root, rel) {
  let dir = path.dirname(rel);
  while (dir && dir !== '.') {
    const abs = path.join(root, dir);
    if (!fs.existsSync(abs) || fs.readdirSync(abs).length) break;
    fs.rmdirSync(abs);
    dir = path.dirname(dir);
  }
}

export function applyTemplate(siteDir, templateDir) {
  const tplManifest = loadManifest(templateDir);
  let siteOwned = [];
  let from = 'unknown';
  try { ({ version: from, templateOwned: siteOwned } = loadManifest(siteDir)); } catch { /* very old or broken site */ }

  const added = [], updated = [], removed = [];
  const tplFiles = walk(templateDir, { skip: SKIP }).filter((f) => matchesAny(f, tplManifest.templateOwned));

  for (const rel of tplFiles) {
    const src = path.join(templateDir, rel);
    const dest = path.join(siteDir, rel);
    const before = readEntry(dest);
    let after;
    if (isSkillLink(rel)) {
      // Always a real symlink, even if the template copy came from a Windows zip as a plain file.
      after = `link:${linkTarget(rel)}`;
      if (!same(before, after)) {
        if (before !== null) fs.rmSync(dest, { recursive: true, force: true });
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        try {
          fs.symlinkSync(linkTarget(rel), dest);
        } catch (err) {
          // Windows without Developer Mode can't create symlinks; leave a git-style pseudo-link.
          if (err.code !== 'EPERM') throw err;
          fs.writeFileSync(dest, linkTarget(rel));
        }
      }
    } else {
      after = readEntry(src);
      if (!same(before, after)) {
        if (before !== null && fs.lstatSync(dest).isSymbolicLink()) fs.rmSync(dest);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
      }
    }
    if (before === null) added.push(rel);
    else if (!same(before, after)) updated.push(rel);
  }

  const keep = new Set(tplFiles);
  for (const rel of walk(siteDir, { skip: SKIP })) {
    // Only delete files that both the old and the new template claim; anything the template
    // has handed over to the site (no longer in templateOwned) now belongs to the site.
    if (keep.has(rel) || !matchesAny(rel, siteOwned) || !matchesAny(rel, tplManifest.templateOwned)) continue;
    fs.rmSync(path.join(siteDir, rel), { force: true });
    removeEmptyParents(siteDir, rel);
    removed.push(rel);
  }

  return { from, to: tplManifest.version, added, updated, removed };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [templateDir, siteDir = '.'] = process.argv.slice(2);
  if (!templateDir) {
    console.error('Usage: node scripts/update-from-template.mjs <extractedTemplateDir> [siteDir]');
    process.exit(1);
  }
  try {
    const r = applyTemplate(path.resolve(siteDir), path.resolve(templateDir));
    console.log(`Template ${r.from} → ${r.to}`);
    for (const [label, list] of [['added', r.added], ['updated', r.updated], ['removed', r.removed]]) {
      for (const f of list) console.log(`  ${label}: ${f}`);
    }
    if (!r.added.length && !r.updated.length && !r.removed.length) console.log('  no changes');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
