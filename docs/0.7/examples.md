# Runnable examples

Use the [first-PDF guide](getting-started.md) to install the pinned domain library.
Keep the examples, binary, and documentation versions together.

| Example | Output and purpose |
| --- | --- |
| `examples/first-document` | FIRST-001.pdf: a minimal document with two prose sections |
| `examples/document-suite` | Four temperature-monitor documents: CRS, SRS, test and verification |
| `examples/drone-srs` | DRN-SRS-001.pdf: requirements tables and model-backed diagrams |
| `examples/house-template` | Customize logo, colors and typography |

```sh
doc42 build examples/document-suite --all --library-path sysml-domain-libraries/model --out out
doc42 build examples/drone-srs --library-path sysml-domain-libraries/model --out out
```

The suite's verification report is authored content, not executed evidence or an
automatic verdict. See [templates](templates.md) to change the presentation and
[authoring](authoring.md) to change the document structure.
