import { mkdirSync, readFileSync, readdirSync, writeFileSync, rmSync, copyFileSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
export const root = fileURLToPath(new URL('..', import.meta.url));
export const release = '0.8.0';
export const nextRelease = '0.8.1';
export function generate() {
  const pages = readdirSync(resolve(root, 'docs')).filter(name => name.endsWith('.md') && name !== 'README.md');
  const output = resolve(root, 'site/.generated');
  if (relative(root, output).split(sep).join('/') !== 'site/.generated') throw new Error('Unsafe generated path');
  rmSync(output, { recursive: true, force: true });
  mkdirSync(resolve(output, 'public'), { recursive: true });
  copyFileSync(resolve(root, 'site/public/logo.svg'), resolve(output, 'public/logo.svg'));
  for (const channel of ['', 'next/']) {
    mkdirSync(resolve(output, channel), { recursive: true });
    for (const page of pages) {
      let content = readFileSync(resolve(root, 'docs', channel, page), 'utf8');
      const applicable = channel ? nextRelease : release;
      const repository = `https://github.com/elan8/doc42-release/tree/${channel ? 'main' : 'v' + release}`;
      content = content.replace(/\]\((?:\.\.\/)+examples/g, `](${repository}/examples`).replace(/\]\((?:\.\.\/)+README\.md/g, `](${repository}/README.md`);
      // Keep snippet includes relative to their original, non-generated source.
      content = content.replace(/^(<<<\s+)(\.\.\/)+examples\//gm, `$1${channel ? '../../../' : '../../'}examples/`);
      // Sources stay readable on GitHub; generated pages use VitePress clean URLs.
      content = content.replace(/\]\(([^)\s]+)\.md(#[^)]*)?\)/g, (match, link, fragment = '') => /^(https?:|mailto:)/.test(link) ? match : `](${link}${fragment})`);
      // Examples are rendered as literal SysML rather than Vue components.
      const preview = channel ? `head:\n  - - meta\n    - name: robots\n      content: noindex\n` : '';
      const notice = channel ? `> **Doc42 ${nextRelease} preview — unreleased.** These instructions require the upcoming executable.\n\n` : '';
      writeFileSync(resolve(output, channel, page), `---\ndocRelease: '${applicable}'\n${preview}---\n\n<div v-pre>\n\n${notice}${content}\n\n</div>\n`);
    }
  }
  return { release, nextRelease, pages };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) generate();
