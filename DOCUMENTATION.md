# Documentation publishing

The site uses VitePress. `docs/*.md` describes released Doc42 **0.8.0**;
`docs/next/*.md` stages **0.8.1**, the embedded-library release. The version menu links
to the current guide and the explicitly unreleased preview. Every preview page has a
visible banner and `noindex` metadata. Generated files in `site/.generated` are disposable.

```sh
npm ci
npm test
npm run docs:build
npm run docs:preview
```

The default host is <https://elan8.github.io/doc42-release/>. GitHub Pages uses Actions.
Pull requests build and check the site; merging into main publishes it. A preview-docs
merge does not publish executable releases or change the action's default version.
Public guides exclude source-build instructions, internal administration references
and private repository links.

## Promote 0.8.1 after publishing binaries

1. Validate packaged Windows and Linux binaries, samples and checksums from the source
   release. Run `scripts/validate-release-examples.py` with `--doc42 <executable>
   --version 0.8.1` and production access from a secret store. Do not pass a separate
   document-library path; 0.8.1 must work with its embedded vocabulary.
2. Publish the matching `v0.8.1` release assets and examples. Keep 0.8.0's tag and assets.
3. Promote `docs/next/` to the current guide, update `release` in `scripts/prepare-docs.mjs`,
   and update the theme, tests, README instructions and `action.yml` default together.
   Remove preview labels for the released guide and retire Next until another preview
   is available. Correct example-relative paths when moving source files.
4. Ensure README, installation, example PDF links and CI commands name 0.8.1 and omit
   the redundant vocabulary checkout. Retain paths for additional project libraries.
5. Run site tests/build and packaged-example checks before merging promotion. Never
   point the current download or action default at unpublished assets.

0.8.1 embeds domain-library 0.6.0 through Spec42 0.60.2. Editors should use the same
vocabulary version. The old library path can load duplicate definitions. The 0.8.0
guide stays accurate for its executable and remains available at its release tag.
