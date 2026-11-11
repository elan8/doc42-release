# Getting started

Install Doc42 from the [releases](https://github.com/elan8/doc42-release/releases), as
the [README](../README.md#install) describes, and check that it runs:

```sh
doc42 --version
```

Doc42 embeds the SysML standard library and needs no Spec42 installation, Typst
executable, font installation or network access. Document metadata comes from the Elan8
domain libraries: clone them, here beside the samples in this repository, and pass their
`model` directory to every command. Configure the same library path in your SysML editor.

```sh
git clone https://github.com/elan8/doc42-release
cd doc42-release
git clone https://github.com/elan8/sysml-domain-libraries
```

`list` and `check` work without a license:

```sh
doc42 list examples/document-suite --library-path sysml-domain-libraries/model
doc42 check examples/document-suite --library-path sysml-domain-libraries/model
```

Building a PDF needs an Elan8 license in the `ELAN8_LICENSE` environment variable:

```sh
export ELAN8_LICENSE=elan8ci_...      # PowerShell: $env:ELAN8_LICENSE = "elan8ci_..."
doc42 build examples/document-suite --doc MonitorDocs::crs --out out \
  --library-path sysml-domain-libraries/model
```

Files are named after the document number, for example `out/MON-CRS-001.pdf`. Build the
other samples with `--doc MonitorDocs::srs`, `--doc MonitorDocs::test` and
`--doc MonitorDocs::verificationReport`. The drone sample adds model-backed diagrams:

```sh
doc42 build examples/drone-srs --out out --library-path sysml-domain-libraries/model
```

For your own model, copy the document-suite structure and replace its model facts, views
and prose; [Authoring documents](authoring.md) explains each part. To give your documents
your own look, start from [Templates](templates.md).

Use `--library-path <directory>` repeatedly for project libraries. Use
`--workspace-root <directory>` when a single-file input needs a wider prose-file boundary.
Use `--cache-dir <directory>` in CI or restricted environments; otherwise the cache uses
`DOC42_CACHE_DIR` or the platform cache directory.

If a build fails, run `doc42 check <model> --json` and look at the diagnostic codes and
source locations. `doc42 ir <model> --doc <qualified-view-name>` shows the selected content
and its provenance before you debug layout.
