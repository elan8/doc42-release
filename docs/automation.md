# Automation and release checks

Run model/document validation before rendering:

```sh
doc42 check model --json --cache-dir .cache/doc42
doc42 ir model --doc ProductDocs::srs > out/srs.ir.json
doc42 build model --doc ProductDocs::srs --out out
```

To build every document of a model, load it once with `--all`:

```sh
doc42 build model --all --out out --json > out/manifest.json
```

Each document is checked before any is rendered, so an error in one leaves no partial set
of PDFs; two documents with the same number, and so the same file, are refused. With
`--json`, `build` prints a manifest: each document's `file`, `qualified_name`, `title`,
`subtitle`, `organization`, `number`, `revision` and `status`, and the error and warning
counts. `list --json` reports the same metadata without a license, for a page or a release
note that links the documents.

Create `out` before redirecting IR. Exit codes: 0 means success; 1 means validation
errors (including a draft rendered despite errors); 2 means a command, selection,
load, output or rendering failure. `check --json` returns source file count, documents,
diagnostics, error count and warning count. Locations use zero-based line/column in JSON
and one-based positions in text output. Doc42 diagnostics have stable `doc42-*` codes;
Spec42 model diagnostics retain their upstream identity.

`doc42-reference-publication-incomplete` means Spec42 supplied a unique canonical
target but marked the broader publication as recovered or unsupported. Doc42 retains
that target in partial IR and reports an error rather than calling it missing. Normal
publication is blocked; explicit `--draft` output remains available. A clean validation
summary for workspace files does not imply that every admitted library is fully
supported. Resolve the upstream obstacle before releasing the document.

Errors block normal PDF rendering. Warnings remain visible but do not block the CLI;
your release job should inspect the JSON warning count and apply an explicit policy.
`--draft` labels the PDF status as DRAFT. A rendered draft with errors still returns
nonzero. A document status string or successful compilation does not constitute approval.
`list` is discovery, not a release gate; use `check` for validation.

Doc42 checks that every figure stays readable where it is placed. When a figure's smallest
text would print below 5 pt, `check`, `build` and `ir` report `doc42-figure-text-size` as a
warning, naming the size and the page. Spec42 draws its smallest labels at 6 pt, so 5 pt
leaves a diagram room to scale. `--min-text-size <pt>` sets another minimum, and
`--strict` reports these figures as errors, so a release job stops on an unreadable figure:

```sh
doc42 check model --strict
doc42 build model --all --out dist --strict
```

For reproducible builds, pin the Doc42 version, the domain-library revision, templates and
model/prose inputs. The renderer uses bundled fonts, no clock, no generated timestamps,
and a stable PDF identifier, so the same inputs give the same PDF bytes.
Absolute provenance paths can change when a workspace moves: compare artifacts in the
same controlled build environment, or normalize paths in your external archival system.
Rendering does not fetch anything; Doc42 embeds the SysML standard library.

Archive the model and prose, IR, check report, tool revision, dependency lockfile and
PDF together. Record content hashes for inputs and outputs in your release system.
Doc42 does not yet emit an automatic baseline/hash manifest. Never use a Git revision
alone to identify an uncommitted model tree.

For executed reports, require externally controlled evidence with case/run identifiers,
tested baseline, procedure revision, recorded timestamp, operator, measurements and units,
uncertainty, deviations, attachment hashes and reviewer disposition. Do not infer a
verdict from a planned link or satisfaction claim. Automatic evidence ingestion,
baseline compatibility checks and acceptance evaluation remain roadmap work.
