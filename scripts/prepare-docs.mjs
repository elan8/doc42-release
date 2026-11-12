import { mkdirSync, readFileSync, readdirSync, writeFileSync, rmSync, copyFileSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
export const root = fileURLToPath(new URL('..', import.meta.url));
export const release = '0.8.0';
export function generate() {
  const pages = readdirSync(resolve(root, 'docs')).filter(name => name.endsWith('.md') && name !== 'README.md');
  const output = resolve(root, 'site/.generated');
  if (relative(root, output).split(sep).join('/') !== 'site/.generated') throw new Error('Unsafe generated path');
  rmSync(output, { recursive: true, force: true });
  mkdirSync(resolve(output, 'public'), { recursive: true });
  copyFileSync(resolve(root, 'site/public/logo.svg'), resolve(output, 'public/logo.svg'));
  for (const page of pages) {
    let content = readFileSync(resolve(root, 'docs', page), 'utf8');
    const repository = `https://github.com/elan8/doc42-release/tree/v${release}`;
    content = content.replaceAll('](../examples', `](${repository}/examples`).replaceAll('](../README.md', `](${repository}/README.md`);
    // Sources stay readable on GitHub; generated pages use VitePress clean URLs.
    content = content.replace(/\]\(([^)\s]+)\.md(#[^)]*)?\)/g, ']($1$2)');
    // Examples are rendered as literal SysML rather than Vue components.
    writeFileSync(resolve(output, page), `---\ndocRelease: '${release}'\n---\n\n<div v-pre>\n\n${content}\n\n</div>\n`);
  }
  return { release, pages };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) generate();
