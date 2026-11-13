# First document

Doc42 starter: one document, two prose sections, and the built-in template.
The command below is identical on Windows PowerShell and Linux shells. From the
extracted package directory (or repository root):

```sh
doc42 list examples/first-document
doc42 check examples/first-document
doc42 login
doc42 build examples/first-document --out out
```

Paste an API token created on your Elan8 account page when login prompts (input is
hidden). The account needs active Doc42 access. Open `out/FIRST-001.pdf`. Models
and documents stay local; obtaining and refreshing the license needs internet access.
For CI set the `ELAN8_TOKEN` secret instead of saving a token interactively.

The standard library and document vocabulary are embedded; no separate library download is needed.
See the [getting-started guide](https://elan8.github.io/doc42-release/getting-started) to create your own document.
