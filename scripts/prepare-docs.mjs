import { mkdirSync, readFileSync, readdirSync, writeFileSync, rmSync, copyFileSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
export const root = fileURLToPath(new URL('..', import.meta.url));
export function versionManifest() {
  const source = JSON.parse(readFileSync(resolve(root, 'site/versions.json'), 'utf8'));
  const ids = new Set();
  for (const version of source.versions) {
    if (!/^\d+\.\d+$/.test(version.id) || ids.has(version.id) || !['released', 'preview'].includes(version.status)) throw new Error('Invalid documentation version');
    ids.add(version.id);
    version.pages = readdirSync(resolve(root, 'docs', version.id)).filter(name => name.endsWith('.md')).map(name => name.slice(0, -3));
    if (!version.pages.includes('index')) throw new Error(`Missing index for ${version.id}`);
  }
  if (source.versions.find(v => v.id === source.latest)?.status !== 'released') throw new Error('latest must point to a released version');
  if (source.versions.find(v => v.id === source.next)?.status !== 'preview') throw new Error('next must point to an unreleased preview version');
  return source;
}
export function generate() {
  const manifest = versionManifest();
  const output = resolve(root, 'site/.generated');
  // Verify the absolute generated target before removing only this disposable directory.
  if (relative(root, output).split(sep).join('/') !== 'site/.generated') throw new Error('Unsafe generated path');
  rmSync(output, { recursive: true, force: true });
  mkdirSync(output, { recursive: true });
  mkdirSync(resolve(output, 'public'), { recursive: true });
  copyFileSync(resolve(root, 'site/public/logo.svg'), resolve(output, 'public/logo.svg'));
  const channels = [...manifest.versions.map(v => ({ ...v, channel: v.id })), ...['latest', 'next'].map(channel => ({ ...manifest.versions.find(v => v.id === manifest[channel]), channel }))];
  for (const version of channels) {
    const dir = resolve(output, version.channel);
    mkdirSync(dir, { recursive: true });
    for (const page of version.pages) {
      let content = readFileSync(resolve(root, 'docs', version.id, page + '.md'), 'utf8');
      // Versioned repository links keep old examples and installation instructions intact.
      const repository = `https://github.com/elan8/doc42-release/tree/${version.ref}`;
      content = content.replaceAll('](../examples', `](${repository}/examples`).replaceAll('](../README.md', `](${repository}/README.md`);
      writeFileSync(resolve(dir, page + '.md'), `---\ndocVersion: '${version.id}'\ndocRelease: '${version.release}'\ndocStatus: '${version.status}'\ndocChannel: '${version.channel}'\ndocPage: '${page}'\n---\n\n<div v-pre>\n\n${content}\n\n</div>\n`);
    }
  }
  writeFileSync(resolve(output, 'version-manifest.json'), JSON.stringify({ ...manifest, channels }, null, 2));
  writeFileSync(resolve(output, 'index.md'), `---\nlayout: home\nhero:\n  name: Doc42\n  text: Engineering documents from your model.\n  tagline: Tutorials, examples and reference material for the version you use.\n  actions:\n    - theme: brand\n      text: Current release ${manifest.latest}\n      link: /latest/\n    - theme: alt\n      text: Preview ${manifest.next}\n      link: /next/\nfeatures:\n  - title: Build your first PDF\n    details: Follow a small, reproducible example with exact commands and library revisions.\n  - title: Author and customize\n    details: Define document views, prose, tables, diagrams and your own templates.\n  - title: Keep versions together\n    details: Choose documentation matching your executable, examples and project baseline.\n---\n`);
  return manifest;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) generate();
