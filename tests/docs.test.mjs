import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { generate, root } from '../scripts/prepare-docs.mjs';
const { release, pages } = generate();
const output = page => readFileSync(resolve(root, 'site/.generated', page), 'utf8');

test('current installation and examples use the same release', () => {
  assert.equal(release, '0.8.0');
  assert.match(output('installation.md'), /doc42-0\.8\.0-windows-x64\.zip/);
  assert.match(output('getting-started.md'), /--branch v0\.8\.0/);
  assert.match(output('authentication.md'), /48 hours after issuance/);
});

test('current documentation has no retired channels or license setup', () => {
  for (const page of pages) {
    const content = output(page);
    assert.match(content, /docRelease: '0\.8\.0'/);
    assert.doesNotMatch(content, /Doc42 0\.[67]|v0\.[67]\.0|ELAN8_LICENSE|\/next\/|\/latest\/|\/0\.[67]\//);
  }
});

test('every repository-relative Markdown link resolves', () => {
  for (const page of pages) {
    const source = resolve(root, 'docs', page);
    const content = readFileSync(source, 'utf8');
    for (const [, target] of content.matchAll(/\]\(([^)\s]+)\)/g)) {
      if (/^(?:https?:|#|\/)/.test(target)) continue;
      assert.ok(existsSync(resolve(dirname(source), target.split('#')[0])), `${page}: ${target}`);
    }
  }
});

test('administrators get the same capability reference as packaged users', () => {
  assert.equal(readFileSync(resolve(root, 'CAPABILITIES.md'), 'utf8'), readFileSync(resolve(root, 'docs/capabilities.md'), 'utf8'));
  assert.match(output('capabilities.md'), /doc42\.generate/);
  assert.match(output('capabilities.md'), /Unfamiliar capabilities for other/);
});
