import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const MANIFEST = {
  version: '0.1.0',
  templateOwned: [
    'AGENTS.md', 'CLAUDE.md', 'template-manifest.json', '.agents/skills/**',
    '.claude/skills/**', 'scripts/**', 'tests/**', '.github/workflows/check.yml',
    'docs/**', 'README.md',
  ],
};

export function write(root, rel, content) {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

export function skill(root, name, description = `Use when testing ${name}.`) {
  write(root, `.agents/skills/${name}/SKILL.md`,
    `---\nname: ${name}\ndescription: ${description}\n---\n\n# ${name}\n`);
  fs.mkdirSync(path.join(root, '.claude/skills'), { recursive: true });
  fs.symlinkSync(`../../.agents/skills/${name}`, path.join(root, `.claude/skills/${name}`));
}

/** Build a minimal valid site repo in a fresh temp dir. */
export function validRepo({ version = '0.1.0', skills = ['setup'] } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aiwt-'));
  write(root, 'template-manifest.json', JSON.stringify({ ...MANIFEST, version }, null, 2));
  write(root, 'AGENTS.md', '# Agent contract\n');
  write(root, 'CLAUDE.md', '@AGENTS.md\n');
  write(root, 'wrangler.jsonc', '{\n  // set by setup\n  "name": "my-website",\n  "assets": { "directory": "./site" }\n}\n');
  write(root, 'site/index.html', '<a href="about.html">About</a><img src="images/a.jpg" alt=""><a href="https://x.com">x</a><a href="#top">t</a><a href="mailto:a@b.c">m</a>');
  write(root, 'site/about.html', '<a href="index.html">Home</a>');
  write(root, 'site/images/a.jpg', 'jpg');
  for (const s of skills) skill(root, s);
  return root;
}
