# Documentation publishing

The VitePress site publishes Doc42 **0.8.1** from `docs/*.md`. The version menu also
serves the preserved **0.8.0** guide from `docs/0.8.0/`. Each guide names its applicable
release; older guides retain the instructions their binaries need. Generated files in
`site/.generated` are disposable.

```sh
npm ci
npm test
npm run docs:build
npm run docs:preview
```

The default host is <https://elan8.github.io/doc42-release/>. GitHub Pages uses Actions.
Pull requests build and check the site; merging into main publishes it. Public guides
exclude source-build instructions, internal administration references and private links.

## Publish a new version

1. Build and validate the Windows and Linux packages, sample PDFs and checksums. Run
   `scripts/validate-release-examples.py --doc42 <executable> --version <version>` with
   production access from a secret store. For 0.8.1 and later, omit a document-library
   path; `--library-path` remains available for checking older executables.
2. Preserve the previous current source pages under `docs/<previous-version>/` before
   updating `docs/*.md`. Keep their release tags and assets. Add the archived version to
   `archivedReleases` in `scripts/prepare-docs.mjs`; it also drives the theme version menu.
3. Update current guides, examples and README together. Set `release` and the action's
   default to the new version only when its validated assets are ready to publish.
4. Run the site tests/build and packaged-example checks. Merge the reviewed publication
   change, tag that exact public commit, and publish its matching assets and release notes.
5. Verify the public download, action tag/default and deployed site all name the same version.

0.8.1 embeds domain-library 0.6.0 through Spec42 0.60.2. Editors should use the same
vocabulary version. Remove the old document-library path when upgrading, while retaining
paths for additional project libraries. A second vocabulary copy can cause ambiguous names.
The 0.8.0 guide keeps its original external-library instructions.
