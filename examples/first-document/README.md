# First document

Doc42 0.7.0 starter: one document, two prose sections, and the built-in template.
The command below is identical on Windows PowerShell and Linux shells. From the
repository root, install the domain library beside this checkout and use its model directory:

```sh
doc42 list examples/first-document --library-path ../sysml-domain-libraries/model
doc42 check examples/first-document --library-path ../sysml-domain-libraries/model
doc42 login
doc42 build examples/first-document --library-path ../sysml-domain-libraries/model --out out
```

Paste an API token created on your Elan8 account page when login prompts (input is
hidden). The account needs active Doc42 access. Open `out/FIRST-001.pdf`. Models
and documents stay local; obtaining and refreshing the license needs internet access.
For CI set the `ELAN8_TOKEN` secret instead of saving a token interactively.
