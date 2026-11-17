import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { generate, groups, root } from '../scripts/prepare-docs.mjs';
import { legacyRedirects, redirectPage } from '../scripts/legacy-redirects.mjs';
const { release, archivedReleases, pages } = generate();
// Current pages are generated into `site/src`; an archived release is `site/archive/v<version>/`.
const output = page => readFileSync(resolve(root, page.includes('/') ? 'site/archive/v' + page : 'site/src/' + page), 'utf8');

test('current installation and examples use the same release', () => {
  assert.equal(release, '0.8.1');
  assert.match(output('installation.md'), /doc42-0\.8\.1-windows-x64\.zip/);
  assert.match(output('getting-started.md'), /doc42 build examples\/first-document --out out/);
  assert.match(readFileSync(resolve(root, 'action.yml'), 'utf8'), /default: "0\.8\.1"/);
  assert.match(output('authentication.md'), /48 hours after issuance/);
});

test('current documentation has no retired channels or license setup', () => {
  for (const page of pages) {
    const content = output(page);
    assert.match(content, /docRelease: '0\.8\.1'/);
    assert.doesNotMatch(content, /Doc42 0\.[67]|v0\.[67]\.0|ELAN8_LICENSE|\/next\/|\/latest\/|\/0\.[67]\//);
    assert.doesNotMatch(content, /unreleased preview|preview — unreleased|not published yet|once 0\.8\.1 is published/i);
  }
});

test('every repository-relative Markdown link resolves', () => {
  for (const page of [...pages, ...archivedReleases.flatMap(version => pages.map(page => version + '/' + page))]) {
    const source = resolve(root, 'docs', page);
    const content = readFileSync(source, 'utf8');
    for (const [, target] of content.matchAll(/\]\(([^)\s]+)\)/g)) {
      if (/^(?:https?:|#|\/)/.test(target)) continue;
      assert.ok(existsSync(resolve(dirname(source), target.split('#')[0])), `${page}: ${target}`);
    }
  }
});

test('public documentation excludes internal permission and administration references', () => {
  assert.equal(existsSync(resolve(root, 'CAPABILITIES.md')), false);
  assert.equal(existsSync(resolve(root, 'site/src/capabilities.md')), false);
  for (const file of ['README.md', 'docs/README.md', 'site/.vitepress/config.mjs', ...pages.flatMap(page => ['docs/' + page, ...archivedReleases.map(version => 'docs/' + version + '/' + page)])]) {
    const content = readFileSync(resolve(root, file), 'utf8');
    assert.doesNotMatch(content, /CAPABILITIES\.md|capabilities\.md|doc42\.generate|run42\.simulate|Products and permissions|\/capabilities\b/i, file);
  }
});

test('0.8.0 retains its external-library instructions while 0.8.1 uses the embedded vocabulary', () => {
  assert.deepEqual(archivedReleases, ['0.8.0']);
  for (const page of pages) {
    // The version notice is a theme component; each archived page names its release in front matter.
    assert.match(output('0.8.0/' + page), /docRelease: '0\.8\.0'\nsource: docs\/[a-z-]+\.md\nref: v0\.8\.0\n/);
  }
  assert.match(output('0.8.0/getting-started.md'), /--library-path sysml-domain-libraries\/model/);
  assert.match(output('0.8.0/installation.md'), /doc42-0\.8\.0-windows-x64\.zip/);
  for (const page of ['getting-started.md', 'examples.md', 'automation.md']) {
    assert.doesNotMatch(output(page), /--library-path (?:\.libraries\/)?sysml-domain-libraries\/model/);
    assert.doesNotMatch(output(page), /git clone.*sysml-domain-libraries/);
  }
  assert.match(output('index.md'), /0\.6\.0, embedded/);
  assert.match(output('troubleshooting.md'), /remove the old document-library path/);
});

test('addresses from before versioned routes forward to the matching versioned guide', () => {
  const redirects = new Map(legacyRedirects());
  assert.equal(redirects.get('installation.html'), `/doc42-release/v${release}/installation`);
  assert.equal(redirects.get('0.8.0/getting-started.html'), '/doc42-release/v0.8.0/getting-started');
  assert.equal(redirects.get('0.8.0/index.html'), '/doc42-release/v0.8.0/');
  assert.equal(redirects.has('index.html'), false, 'the plugin already redirects the home page');
  for (const page of pages.filter(page => page !== 'index.md')) {
    assert.ok(redirects.has(page.replace(/.md$/, '.html')), page);
    assert.ok(existsSync(resolve(root, 'site/src', page)), `redirect target for ${page} exists`);
  }
  const html = redirectPage('/doc42-release/v0.8.1/cli');
  assert.ok(html.includes('http-equiv="refresh" content="0; url=/doc42-release/v0.8.1/cli"'));
  assert.ok(html.includes('rel="canonical" href="/doc42-release/v0.8.1/cli"'));
});

test('every guide is in exactly one sidebar group with a title, and pages name their source', () => {
  const routes = groups.flatMap(group => group.pages.map(page => page.route));
  assert.deepEqual([...routes].sort(), pages.map(page => page.replace(/\.md$/, '')).sort());
  assert.equal(new Set(routes).size, routes.length, 'no guide is listed twice');
  for (const page of pages) {
    const front = output(page).split('\n---\n')[0];
    assert.match(front, /^---\ntitle: "[^"]+"\ndocRelease: '0\.8\.1'\nsource: docs\/[a-z-]+\.md\nref: v0\.8\.1$/, page);
  }
});

test('the home page follows the shared structure', () => {
  const home = output('index.md');
  for (const heading of ['## Get started', '## Work with your documents', '## Put it into your workflow', '## Compatibility']) assert.ok(home.includes(heading), heading);
});
