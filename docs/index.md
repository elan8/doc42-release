# Generate your first engineering PDF

Generate engineering PDFs from SysML v2 document views with **Doc42 0.8.1**. The standard
library and public document vocabulary are embedded, so no separate domain-library checkout is
needed. Choose the documentation version that matches your installation.

## Get started

1. [Install Doc42](installation.md) for Windows or Linux.
2. [Create an API token and sign in](authentication.md) so Doc42 can obtain a license.
3. [Build your first PDF](getting-started.md) from the included example.

## Work with your documents

- [Document authoring](authoring.md): the model owns content and section order.
- [Templates](templates.md): choose a document template and its sample view.
- [Examples](examples.md): runnable models you can adapt.

## Put it into your workflow

[Automate validation and builds](automation.md), and look up every command in the
[CLI reference](cli.md).

If something goes wrong, start with [troubleshooting](troubleshooting.md).

## Compatibility

| Component | Baseline |
| --- | --- |
| Doc42 | 0.8.1 |
| Spec42 engine | 0.60.2, embedded; a separate Spec42 installation is not required |
| SysML standard library | 2026-04, embedded |
| Domain libraries | 0.6.0, embedded |
| Authentication | API token (`ELAN8_TOKEN` or `doc42 login`) |
| Platforms | Windows x64 and Linux x64 (glibc 2.35 or later) |

The compiler and fonts are included. Models and documents are processed locally.
Internet access is required to obtain and refresh licenses for PDF generation.
Tables can display verdict records written by a run. Doc42 does not judge a case,
and missing records are shown as `not run`. Other structured test evidence ingestion
and automatic verification verdicts are not supported.

## Upgrade from 0.8.0

Remove the document-vocabulary checkout and its `--library-path` argument from scripts.
Keep paths for additional project libraries. Loading a second copy of the embedded
vocabulary can make references ambiguous. Use domain-library 0.6.0 in your editor.
