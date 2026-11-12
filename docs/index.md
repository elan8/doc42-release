# Doc42 0.8

Generate engineering PDFs from SysML v2 document views with **Doc42 0.8.0**.

Start with [installation](installation.md), then [your first PDF](getting-started.md).
Learn [document authoring](authoring.md), [templates](templates.md),
[API-token authentication](authentication.md), and [automation](automation.md).
The [CLI reference](cli.md) and [troubleshooting guide](troubleshooting.md) explain failures.

## Compatibility

| Component | Baseline |
| --- | --- |
| Doc42 | 0.8.0 |
| Spec42 engine | 0.60.1, embedded; a separate Spec42 installation is not required |
| SysML standard library | 2026-04, embedded |
| Domain libraries | revision `146fe5ca70e76d8692e96f4a666e974592c40abc` |
| Authentication | API token (`ELAN8_TOKEN` or `doc42 login`) |
| Platforms | Windows x64 and Linux x64 (glibc 2.35 or later) |

The compiler and fonts are included. Models and documents are processed locally.
Internet access is required to obtain and refresh licenses for PDF generation.
Structured test evidence ingestion and automatic verification verdicts are not supported.
