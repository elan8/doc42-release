# House template

A house template made from Doc42's built-in `elan8-standard`, with the edits most
organizations make. Every change is marked `House style:` in the files.

| File | What it changes |
| --- | --- |
| `main.typ` | The colours of the tables, quotes and code blocks Doc42 generates, through `doc42-theme` |
| `engineering.typ` | The house colours, a left-aligned cover with the logo, and the logo in the running header |
| `assets/logo.svg` | A placeholder logo; replace it with yours |

Try it on the drone sample, from the root of this repository:

```sh
doc42 build examples/drone-srs --template examples/house-template --out out \
  --library-path sysml-domain-libraries/model
```

To make your own, start from a built-in template rather than from this copy, so you get
the layout of the Doc42 version you use:

```sh
doc42 template export elan8-standard documents/template
```

Then select it in the model, relative to the model file: `template = "template";` in
`@Document`. [Templates](../../docs/templates.md) describes what a template can use: its own
files and fonts, the document's metadata and the Doc42 package.
