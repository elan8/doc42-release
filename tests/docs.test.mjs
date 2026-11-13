import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { generate, root } from '../scripts/prepare-docs.mjs';
const { release, archivedReleases, pages } = generate();
const output = page => readFileSync(resolve(root, 'site/.generated', page), 'utf8');

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
  assert.equal(existsSync(resolve(root, 'site/.generated/capabilities.md')), false);
  for (const file of ['README.md', 'docs/README.md', 'site/.vitepress/config.mjs', ...pages.flatMap(page => ['docs/' + page, ...archivedReleases.map(version => 'docs/' + version + '/' + page)])]) {
    const content = readFileSync(resolve(root, file), 'utf8');
    assert.doesNotMatch(content, /CAPABILITIES\.md|capabilities\.md|doc42\.generate|run42\.simulate|Products and permissions|\/capabilities\b/i, file);
  }
});

test('0.8.0 retains its external-library instructions while 0.8.1 uses the embedded vocabulary', () => {
  assert.deepEqual(archivedReleases, ['0.8.0']);
  for (const page of pages) {
    assert.match(output('0.8.0/' + page), /Doc42 0\.8\.0 archive/);
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
