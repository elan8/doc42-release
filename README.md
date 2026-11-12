# Doc42

Doc42 generates engineering documents, such as requirements specifications and
design descriptions, from a SysML v2 repository. What a document contains and
how it is structured is defined in SysML v2; tables and diagrams are projected
from the model, so the document cannot drift from it. The output is PDF.

This repository publishes Doc42: the `doc42` command-line tool for Linux and
Windows, and a GitHub Action that installs it. Doc42 is closed-source software by
[Elan8](https://elan8.com).

Documentation is versioned: [0.7 (current)](docs/0.7/index.md) and
[0.6 (archive)](docs/0.6/index.md). Use the guide matching `doc42 --version`.
The [documentation](docs/README.md) covers [getting started](docs/getting-started.md),
[authoring documents](docs/authoring.md), [templates](docs/templates.md) and
[automation](docs/automation.md). The [samples](examples) include four documents for a
small product, a requirements specification with diagrams, and a
[house template](examples/house-template) to start your own from.

## Install

Download the archive for your platform and `SHA256SUMS.txt` from the
[releases](https://github.com/elan8/doc42-release/releases), check the archive,
and unpack it:

| Platform | Archive | Requirements |
| --- | --- | --- |
| Linux x64 | `doc42-<version>-linux-x64.tar.gz` | glibc 2.35 or later (Ubuntu 22.04, Debian 12 and newer) |
| Windows x64 | `doc42-<version>-windows-x64.zip` | 64-bit Windows |

```sh
sha256sum --check --ignore-missing SHA256SUMS.txt
tar -xzf doc42-<version>-linux-x64.tar.gz
./doc42 --version
```

On Windows, check the archive with `Get-FileHash doc42-<version>-windows-x64.zip`
against `SHA256SUMS.txt`, then extract it. macOS builds are not published yet.

## Use in GitHub Actions

```yaml
jobs:
  documents:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Document metadata comes from the Elan8 domain libraries.
      - uses: actions/checkout@v4
        with:
          repository: elan8/sysml-domain-libraries
          path: .libraries/sysml-domain-libraries

      - uses: elan8/doc42-release@v0.7.0

      - run: doc42 check model --library-path .libraries/sysml-domain-libraries/model

      - run: >-
          doc42 build model --library-path .libraries/sysml-domain-libraries/model
          --doc ProductDocs::srs --out out
        env:
          ELAN8_TOKEN: ${{ secrets.ELAN8_TOKEN }}

      - uses: actions/upload-artifact@v4
        with:
          name: documents
          path: out/*.pdf
```

The action installs Doc42 on Linux x64 runners and puts `doc42` on the `PATH`. To
run a single command in the same step, pass it as `args` and set `ELAN8_TOKEN`
on that step:

```yaml
- uses: elan8/doc42-release@v0.7.0
  with:
    args: build model --library-path .libraries/sysml-domain-libraries/model --doc ProductDocs::srs --out out
  env:
    ELAN8_TOKEN: ${{ secrets.ELAN8_TOKEN }}
```

| Input | Default | Meaning |
| --- | --- | --- |
| `version` | `0.7.0` | Doc42 version to install |
| `args` | empty | Arguments for one `doc42` run; empty installs only |
| `working-directory` | `.` | Directory to run `doc42` in |

The output `executable-path` is the path of the installed executable.

A working example is the
[robot vacuum cleaner showcase](https://github.com/elan8/sysml-robot-vacuum-cleaner),
which builds its customer requirements, system requirements, system design and
verification documents.

This repository was called `doc42-action` until version 0.4.0. Download links
and `elan8/doc42-action@v0.4.0` keep working through GitHub's redirect; use
`elan8/doc42-release` in new workflows.

## API-token authentication

`doc42 list`, `doc42 check` and template operations need no account or license.
`doc42 build` and `doc42 ir` require Doc42 access and an Elan8 API token.

Create a token on your [Elan8 account](https://www.elan8.com/account?section=tokens).
Run `doc42 login` locally; the prompt hides the token. In GitHub Actions, store
it as `ELAN8_TOKEN` and pass it only to the step that generates documents.
`ELAN8_LICENSE` belongs to 0.6 and is no longer used in 0.7.

Doc42 exchanges the token online for a signed license, verifies it locally and
refreshes it after 24 hours. If Elan8 is unreachable, an already cached license
works until it expires, at most 48 hours after issuance. Models and documents
stay on the runner. `doc42 license` reports status without printing credentials;
`doc42 logout` removes the saved token and cached licenses.

Secrets are not available to pull requests from forks. Skip the build step for
them:

```yaml
if: github.event_name != 'pull_request' || github.event.pull_request.head.repo.full_name == github.repository
```

To obtain a license, contact Elan8 through [elan8.com/contact](https://elan8.com/contact).

## Writing documents

A document is a SysML view annotated with `@Elan8::Documents::Document`; its
nested views are the sections. The metadata comes from
[`sysml-domain-libraries`](https://github.com/elan8/sysml-domain-libraries): pass
its `model` directory with `--library-path`, and use the same library path in your
editor.

```sysml
package ProductDocs {
    private import Elan8::Documents::*;
    private import StandardViewDefinitions::*;

    view srs {
        @Document {
            title = "Product";
            organization = "Example Engineering";
            number = "PRD-SRS-001";
            revision = "A";
            template = "srs";
        }
        view purpose {
            @Section { title = "Purpose and scope"; }
            doc /* What the system is and what this document covers. */
        }
        view requirements : GeneralView {
            @Section { title = "System requirements"; }
            @RequirementTable;
            expose Product::ResponseRequirement;
        }
        view architecture : InterconnectionView {
            @Section { title = "System interconnection"; }
            @Diagram { depth = 1; }
            expose Product::system;
        }
    }
}
```

`@Diagram { depth = n; }` draws `n` levels of parts below the exposed elements and
the deeper ones closed; without it, every level is drawn.

Built-in templates: `crs` (customer requirements), `srs` (system requirements),
`sds` (system design), `test` (test specification), `verification-report` and
the general `elan8-standard`. `doc42 template export <name> <dir>` writes one as
the starting point for your own; [Templates](docs/templates.md) explains how to adapt
it, and [`examples/house-template`](examples/house-template) shows the usual edits.

Doc42 reads models with [Spec42](https://github.com/elan8/spec42), the
open-source SysML v2 toolchain by Elan8. Pass additional SysML libraries with
`--library-path`.

## Legal

The Doc42 executable is proprietary software, © Elan8, all rights reserved. See
[LICENSE.md](LICENSE.md). Third-party components are listed in the
`THIRD_PARTY_NOTICES.md` and `THIRD_PARTY_LICENSES.md` files inside each release
archive. The action definition and the examples in this repository may be copied
freely.
