import { defineVersionedConfig } from '@viteplus/versions';
import { sharedConfig } from './shared.mjs';
import { groups, release } from '../../scripts/prepare-docs.mjs';

export default defineVersionedConfig({
  ...sharedConfig({
    product: 'Doc42',
    slug: 'doc42',
    repo: 'elan8/doc42-release',
    base: process.env.DOCS_BASE || '/doc42-release/',
    latest: `v${release}`,
    description: 'Doc42 user guides: generate engineering documents from SysML v2 models. Installation, authoring, templates, automation and CLI reference.',
    footer: 'Models and documents stay local. License retrieval and refresh require online access.',
    license: 'Proprietary',
    groups
  }),
  // The current release is the latest; older ones are frozen under `archive/`. The switcher is the
  // `VersionSwitcher` component placed in the shared nav; the plugin's own dropdown would repeat it.
  versionsConfig: { current: `v${release}`, versionSwitcher: false }
});
