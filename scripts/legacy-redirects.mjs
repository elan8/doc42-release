import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { archivedReleases, listPages, release } from './prepare-docs.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const base = process.env.DOCS_BASE || '/doc42-release/';

// Before versioned routes the guides lived at `/<page>` and `/<archived-version>/<page>`. Other
// sites, the action's documentation and example READMEs link to those addresses, so each one
// forwards to its versioned equivalent. The home page is already redirected by the plugin.
export function legacyRedirects() {
  const names = listPages().map(page => page.replace(/\.md$/, '')).filter(page => page !== 'index');
  return [
    ...names.map(page => [`${page}.html`, `${base}v${release}/${page}`]),
    ...archivedReleases.flatMap(version => [
      [`${version}/index.html`, `${base}v${version}/`],
      ...names.map(page => [`${version}/${page}.html`, `${base}v${version}/${page}`])
    ])
  ];
}

export function redirectPage(destination) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Redirecting…</title><meta name="robots" content="noindex"><link rel="canonical" href="${destination}"><meta http-equiv="refresh" content="0; url=${destination}"></head><body><a href="${destination}">Continue to the Doc42 guide</a></body></html>
`;
}

export function writeLegacyRedirects(outDir = resolve(root, 'site/.vitepress/dist')) {
  const redirects = legacyRedirects();
  for (const [file, destination] of redirects) {
    const target = resolve(outDir, file);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, redirectPage(destination));
  }
  return redirects.length;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Wrote ${writeLegacyRedirects()} legacy redirects.`);
}
