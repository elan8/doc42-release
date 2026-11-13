# Getting started with Doc42 0.8.1

This is an unreleased preview. Use a matching 0.8.1 executable once it is published;
Doc42 0.8.0 still needs the separately installed document vocabulary.

## Build the included example

Download and extract the package for your platform from the
[release repository](https://github.com/elan8/doc42-release) once 0.8.1 is published.
Put the executable on your PATH. In a terminal opened in the extracted package directory:

```sh
doc42 list examples/first-document
doc42 check examples/first-document
doc42 login
doc42 build examples/first-document --out out
```

Paste your API token at the hidden login prompt. Building requires active Doc42
access. Open `out/FIRST-001.pdf`. `list` and `check` need no account. In CI, set
`ELAN8_TOKEN` from a secret store instead of interactive login.

The compiler, fonts, SysML standard library and public document vocabulary are
embedded. No separate domain-library download is required. Models and PDFs stay
local. Internet access is required to obtain and refresh a license. A verified
cached license remains usable until expiry if the backend cannot be reached,
at most 48 hours after issuance or sooner if access or the token expires.

## Create your own document

Create a project directory and save this as `Product.sysml` inside it:

```sysml
package ProductDocs {
    private import Elan8::Documents::*;
    requirement def <'SYS-001'> ResponseTime {
        doc /* The product shall respond within 100 ms. */
    }
    view specification {
        @Document {
            title = "Product system requirements";
            number = "PRD-SRS-001";
            revision = "A";
            status = "Draft";
            template = "srs";
        }
        view scope {
            @Section { title = "Purpose and scope"; }
            doc /* Define the product boundary and intended users here. */
        }
        view requirements {
            @Section { title = "Requirements"; }
            @Table { columns = "ID = id, Requirement = name, Description = text"; }
            expose ProductDocs::ResponseTime;
        }
    }
}
```

From that project directory, check and build it:

```sh
doc42 check .
doc42 build . --doc ProductDocs::specification --out out
```

Open `out/PRD-SRS-001.pdf`. Edit the title and scope, add requirements to your
model, and expose them in the table. Nested views determine section order.
Use [the authoring guide](authoring.md) for Markdown files, model values,
relationships and diagrams. A template changes layout; it does not insert content.

To apply your house style:

```sh
doc42 template export srs documents/template
doc42 build . --doc ProductDocs::specification --template documents/template --out out
```

Edit the exported `main.typ` and `engineering.typ` to change the cover, fonts,
colours, headers and footers. Put logos in the template directory. See
[Templates](templates.md) for supported assets and styling.

## Project libraries and editor setup

Doc42 embeds domain-library version 0.6.0. Use the same public vocabulary version
in your editor. A compatible Spec42 editor release can provide it from its bundle.
Additional project libraries can be supplied with repeated `--library-path` options;
the document vocabulary needs no option.

When upgrading from 0.8.0, remove the old domain-library `--library-path` argument
from scripts. Supplying a second copy of that vocabulary can make references ambiguous.

Run `doc42 check . --json` for machine-readable diagnostics and
`doc42 build . --all --out out` to build every document in a project. Use
`--workspace-root` when a single-file input needs a wider prose-file boundary.

Reusable document/view types, automatic evidence assessment, DOCX output and a
watch workflow remain unsupported. Templates can be shared between projects;
document sections are authored explicitly. See [Automation](automation.md) for CI.
