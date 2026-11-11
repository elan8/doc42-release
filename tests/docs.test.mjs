import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { generate, root } from '../scripts/prepare-docs.mjs';
const manifest = generate();
const output = page => readFileSync(resolve(root, 'site/.generated', page), 'utf8');
test('stable aliases never advertise unreleased behavior', () => {
  assert.equal(manifest.latest, '0.7');
  assert.match(output('latest/getting-started.md'), /doc42 login/);
  assert.match(output('latest/getting-started.md'), /--branch v0\.7\.0/);
  assert.match(output('latest/getting-started.md'), /docStatus: 'released'/);
  assert.doesNotMatch(output('latest/getting-started.md'), /0\.7\.0 preview|versioned-docs-0\.7/);
  assert.match(output('next/index.md'), /docStatus: 'preview'/);
  assert.match(output('next/index.md'), /No 0\.8 executable is/);
});
test('archived 0.6 authoring sources match the actual release tag', () => {
  for (const file of ['getting-started.md', 'authoring.md', 'templates.md', 'automation.md']) {
    const original = execFileSync('git', ['show', `v0.6.0:docs/${file}`], { cwd: root });
    assert.deepEqual(readFileSync(resolve(root, 'docs/0.6', file)), original);
  }
});
test('the preview migration and authentication instructions distinguish credentials', () => {
  assert.match(output('0.7/migration.md'), /ELAN8_LICENSE/);
  assert.match(output('0.7/migration.md'), /ELAN8_TOKEN/);
  const auth = output('0.7/authentication.md');
  for (const text of ['24 hours', '48 hours after issuance', 'confirmed refusal', 'logout']) assert.ok(auth.includes(text));
});
test('every version and alias has an overview and discoverable pages', () => {
  const generated = JSON.parse(output('version-manifest.json'));
  for (const channel of generated.channels) {
    assert.ok(channel.pages.includes('index'));
    for (const page of channel.pages) assert.match(output(`${channel.channel}/${page}.md`), /docVersion:/);
  }
});
