# Templates and document samples

| Template | Sample view | Intended content |
| --- | --- | --- |
| `crs` | `MonitorDocs::crs` | Stakeholder scope, customer needs, assumptions and open decisions |
| `srs` | `MonitorDocs::srs` | System boundary, system requirements, traceability rationale and planned verification |
| `sds` | — | System design: architecture, decomposition, interfaces, allocation and design rationale |
| `test` | `MonitorDocs::test` | Objective, test configuration, procedure, acceptance criteria and required records |
| `verification-report` | `MonitorDocs::verificationReport` | Evidence baseline, execution status, deviations, assessment, coverage and release conclusion |
| `elan8-standard` | `DroneDocs::droneSrs` | General engineering publication with requirement tables and diagrams |

Run `doc42 build examples/document-suite --doc MonitorDocs::crs --out out` and
substitute the view from the table; see [Getting started](getting-started.md) for the library path. `doc42 build ... --template srs` changes only layout;
it does not select system requirements or insert sections. Classification comes from
the authored document view, never an identifier prefix.

Each built-in template is a small Typst entry point. It imports the shared
`engineering-document` function from `/engineering.typ`, which supplies A4 pages,
document control, running headers, page totals, numbered headings and an outline.
`/doc42.typ` renders all IR blocks. Content reaches Typst as JSON data, so model text
containing Typst markup is not evaluated as template code.

## Your own template

A template is a directory with a `main.typ`. Start from a built-in one:

```sh
doc42 template list
doc42 template export srs documents/template
```

This writes `main.typ` and `engineering.typ`. Edit them for your house style: logo, colours,
fonts, title page, headers and footers, document control fields. Then select the directory, in
the model or on the command line:

```sysml
@Document { title = "Product"; template = "template"; }   // relative to this model file
```

```sh
doc42 build . --doc ProductDocs::srs --template documents/template
```

A name of a built-in template selects that template; anything else is a directory. A directory
named in the model must be inside the workspace, so that the template is versioned with the
documents it lays out.

What a template can use:

- **Its own files.** Every file in the directory is available by its path from the directory:
  `#import "/parts/cover.typ": cover`, `#image("/assets/logo.svg")`, `#read("/assets/legal.txt")`.
  Hidden files and symbolic links are left out.
- **Its own fonts.** TrueType and OpenType files in `fonts/` are available by family name,
  besides the fonts bundled with Doc42 (Libertinus Serif, New Computer Modern, DejaVu Sans Mono).
- **The document.** `json("/doc42.json")` is the document: `meta` (title, subtitle, organization,
  number, revision, status) and `body`. The fields are described by `doc42 ir`.
- **The Doc42 package.** `#import "/doc42.typ": doc42-body` renders the body. `/doc42.typ` and
  `/doc42.json` belong to Doc42 and cannot be replaced; `/engineering.typ` is the built-in layout
  unless the template has its own.

What it cannot use: files outside its directory, Typst packages (`@preview/...`), the network
and the clock. A build depends only on the model, the template directory and the Doc42 version,
and the same three give the same PDF bytes.

All styling belongs in the template. The colours of content that Doc42 generates are a theme
the template sets before the body:

```typst
#import "/doc42.typ": doc42-body, doc42-theme
#doc42-theme.update(theme => {
  theme.table-header = rgb("#155e75")   // also: table-header-text, table-stripe, table-rule,
  theme.table-stripe = rgb("#f9fafb")   // quote-rule, quote-text, code-fill
  theme
})
```

Fonts, headings, page geometry, headers and footers are ordinary Typst `set` and `show` rules in
the template. Two things are not styled by the template: an authored SVG figure keeps the colours
and fonts it was drawn with, and a generated diagram is drawn by Spec42.

One template can serve several documents. The built-in templates pass the kind of document to
the layout from `main.typ`; a house template can read it from the document instead, for example
from `meta.subtitle`.

A template is layout. Keep content and model semantics out of it: a table or a value belongs in
the document view, where it is checked against the model.

The examples intentionally contain no fabricated pass result. Test and report documents
currently publish editorial procedure and assessment prose. They do not query case
objectives, ingest evidence, calculate verdicts or generate coverage matrices.
Verification checks system requirements; customer validation requires separate evidence
against stakeholder needs. Missing evidence must remain visible in both document status
and conclusions.

The samples are starting points for project-specific review, not a claim of compliance
with a document standard. [`examples/house-template`](../examples/house-template) is a
small house template made from `elan8-standard`, and the
[robot vacuum cleaner showcase](https://github.com/elan8/sysml-robot-vacuum-cleaner/tree/main/model/80_documents/template)
has a complete one with its own fonts and logo.
