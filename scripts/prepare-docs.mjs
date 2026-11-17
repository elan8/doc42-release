import { mkdirSync, readFileSync, readdirSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
export const root = fileURLToPath(new URL('..', import.meta.url));
export const release = '0.8.1';
export const archivedReleases = ['0.8.0'];
// The sidebar groups, in reading order. Every guide appears in exactly one group.
export const groups = [
  { title: 'Start here', pages: [{ route: 'index', title: 'Overview' }, { route: 'installation', title: 'Installation' }, { route: 'authentication', title: 'Accounts and API tokens' }, { route: 'getting-started', title: 'Your first PDF' }] },
  { title: 'Use Doc42', pages: [{ route: 'authoring', title: 'Authoring documents' }, { route: 'templates', title: 'Templates' }, { route: 'examples', title: 'Examples' }] },
  { title: 'Automate', pages: [{ route: 'automation', title: 'Automation' }, { route: 'cli', title: 'CLI reference' }] },
  { title: 'Help and reference', pages: [{ route: 'troubleshooting', title: 'Troubleshooting' }] }
];
const titles = new Map(groups.flatMap(group => group.pages.map(page => [page.route, page.title])));
export const listPages = () => readdirSync(resolve(root, 'docs')).filter(name => name.endsWith('.md') && name !== 'README.md');
export function generate() {
  const pages = listPages();
  // @viteplus/versions serves `src/` as the current release and each `archive/<version>/` as a frozen one.
  const output = resolve(root, 'site');
  for (const generated of ['src', 'archive']) {
    const directory = resolve(output, generated);
    if (relative(root, directory).split(sep).join('/') !== `site/${generated}`) throw new Error('Unsafe generated path');
    rmSync(directory, { recursive: true, force: true });
  }
  for (const channel of ['', ...archivedReleases.map(version => `${version}/`)]) {
    const target = channel ? `archive/v${channel}` : 'src';
    mkdirSync(resolve(output, target), { recursive: true });
    for (const page of pages) {
      let content = readFileSync(resolve(root, 'docs', channel, page), 'utf8');
      const applicable = channel ? channel.slice(0, -1) : release;
      const repository = `https://github.com/elan8/doc42-release/tree/v${applicable}`;
      content = content.replace(/\]\((?:\.\.\/)+examples/g, `](${repository}/examples`).replace(/\]\((?:\.\.\/)+README\.md/g, `](${repository}/README.md`);
      // Keep snippet includes relative to their original, non-generated source.
      content = content.replace(/^(<<<\s+)(\.\.\/)+examples\//gm, `$1${channel ? '../../../' : '../../'}examples/`);
      // Sources stay readable on GitHub; generated pages use VitePress clean URLs.
      content = content.replace(/\]\(([^)\s]+)\.md(#[^)]*)?\)/g, (match, link, fragment = '') => /^(https?:|mailto:)/.test(link) ? match : `](${link}${fragment})`);
      // Examples are rendered as literal SysML rather than Vue components. The version notice and
      // the source link are theme components driven by this front matter. An archived guide's
      // source is the file as it was at that release's tag (`docs/<page>`); the `docs/<version>/`
      // copy only exists on main.
      const route = page.replace(/\.md$/, '');
      const title = JSON.stringify(titles.get(route));
      writeFileSync(resolve(output, target, page), `---\ntitle: ${title}\ndocRelease: '${applicable}'\nsource: docs/${page}\nref: v${applicable}\n---\n\n<div v-pre>\n\n${content}\n\n</div>\n`);
    }
  }
  return { release, archivedReleases, pages };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) generate();
