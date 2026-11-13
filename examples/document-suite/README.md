# Engineering document suite

Four runnable composition templates share a small temperature-monitor model. The
requirements are illustrative prose-only definitions; test and report sections are
authored editorial content, with no executed evidence or automated verdict.

```sh
doc42 check examples/document-suite
doc42 build examples/document-suite --doc MonitorDocs::crs --out out
doc42 build examples/document-suite --doc MonitorDocs::srs --out out
doc42 build examples/document-suite --doc MonitorDocs::test --out out
doc42 build examples/document-suite --doc MonitorDocs::verificationReport --out out
```

Copy this directory to begin a project. Replace the model, qualified references,
document numbers, scope, procedures and review records. Keep the report's no-evidence
status until controlled execution evidence is available. See [authoring](../../docs/authoring.md)
and [templates](../../docs/templates.md) for the supported contract and limitations.
