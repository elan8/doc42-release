# CLI reference

These commands describe Doc42 0.7.0 preview. Run `doc42 <command> --help` for all options.

| Command | Purpose | Access |
| --- | --- | --- |
| `doc42 list <model>` | Find document views; `--json` includes metadata | Free |
| `doc42 check <model>` | Validate model and documents; `--json` reports diagnostics | Free |
| `doc42 build <model>` | Generate a PDF, or all documents with `--all` | Active Doc42 access |
| `doc42 ir <model>` | Inspect the document IR as JSON | Active Doc42 access |
| `doc42 login` | Validate and save an API token from hidden input or stdin | Online |
| `doc42 logout` | Remove the saved token and cached licenses | Local |
| `doc42 license` | Report token source, license status and expiry | Uses cache or online exchange |
| `doc42 template list` | List built-in layouts | Free |
| `doc42 template export <name> <dir>` | Copy a layout for customization | Free |

## Model and output options

- `<model>` is a .sysml file or directory; default is the current directory.
- Repeat `--library-path <directory>` for project libraries.
- `--workspace-root <directory>` widens the workspace boundary for a single-file input.
- `--cache-dir <directory>` selects the model cache, separate from the license cache.
- `--doc <qualified-name>` selects a document for check, build or ir.
- `--all` builds every document; it conflicts with `--doc`.
- `--out <directory>` chooses the PDF directory (default `out`).
- `--template <name-or-directory>` overrides the document layout for build.
- `--draft` renders explicitly labeled draft output; errors still cause failure.
- `--min-text-size <pt>` and `--strict` control figure readability checks.

## Exit codes

0 means success; 1 means validation errors; 2 means command, authentication, loading,
selection, output or rendering failure. A rendered draft is not a release artifact.
See [automation](automation.md) for JSON diagnostics and manifests.
