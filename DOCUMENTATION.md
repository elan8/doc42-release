# Documentation publishing

The site uses VitePress. Sources live in versioned docs/ directories, not in the generated
site/.generated directory. Version metadata is in site/versions.json. The site
builds /0.6/, /0.7/, /latest/ and /next/; latest must name a released version.
The navigation selector keeps the current page when the destination version has it,
and falls back to that version's overview otherwise. Every guide displays its
applicable release. Preview and alias pages are marked noindex.

```sh
npm ci
npm test
npm run docs:build
npm run docs:preview
```

Default hosting is https://elan8.github.io/doc42-release/. GitHub Pages must use
GitHub Actions as its publishing source. The workflow builds and checks pull
requests; only main publishes. A custom domain such as doc42.elan8.com can be
configured later; set DOCS_BASE=/ for that build and configure the verified domain
in Pages and DNS. The generated static output is site/.vitepress/dist.

The build uses the pinned VitePress 2 preview with its lockfile and patched Vite
dependencies. Review updates deliberately; npm audit currently reports no advisories.

The 0.6 source pages are exact snapshots from tag v0.6.0. Do not change them to
show 0.7 behavior. Advance latest and the action default only after the matching
binaries and checksums are published. Doc42 0.7 is the current release; the next
channel points to the separate 0.8 placeholder, which is explicitly unreleased.
Use release tags for released examples and guides; never silently change old guides.

Run scripts/validate-release-examples.py against the matching packaged executable
with an ELAN8_TOKEN secret and the pinned domain library before marking 0.7 released.
Never put a real token in docs, scripts or tests. The private source release workflow
also validates actual PDFs with Windows and Linux binaries.
