import fs from 'node:fs';
import path from 'node:path';

export const MANIFEST_FILE = 'template-manifest.json';

/** Convert a glob ("**" = any depth, "*" = within one path segment) to a RegExp. */
function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*' && glob[i + 1] === '*') {
      // "dir/**" also matches "dir" itself.
      if (re.endsWith('/')) re = re.slice(0, -1) + '(?:/.*)?';
      else re += '.*';
      i++;
    } else if (c === '*') {
      re += '[^/]*';
    } else {
      re += c.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
    }
  }
  return new RegExp(`^${re}$`);
}

export function matchesAny(relPath, globs) {
  return globs.some((g) => globToRegExp(g).test(relPath));
}

export function loadManifest(rootDir) {
  const file = path.join(rootDir, MANIFEST_FILE);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    throw new Error(`Could not read ${MANIFEST_FILE} in ${rootDir}: ${err.message}`);
  }
  if (typeof data.version !== 'string' || !Array.isArray(data.templateOwned)) {
    throw new Error(`${MANIFEST_FILE} must have a "version" string and a "templateOwned" array`);
  }
  return { version: data.version, templateOwned: data.templateOwned };
}

/** List every file (and symlink) under rootDir as "/"-separated relative paths. */
export function walk(rootDir, { skip = [] } = {}) {
  const out = [];
  const visit = (rel) => {
    const abs = path.join(rootDir, rel);
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      const childRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (skip.includes(entry.name) || skip.includes(childRel)) continue;
      if (entry.isDirectory()) visit(childRel);
      else out.push(childRel);
    }
  };
  visit('');
  return out.sort();
}
