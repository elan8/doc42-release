# Your first PDF

Follow [installation](installation.md) first. This guide targets Doc42 **0.8.0**.
It uses one small model and produces `out/FIRST-001.pdf`.

## 1. Get the example and its library

Download or clone the release repository at the matching release tag.

```sh
git clone --branch v0.8.0 https://github.com/elan8/doc42-release
cd doc42-release
git clone https://github.com/elan8/sysml-domain-libraries
git -C sysml-domain-libraries checkout 146fe5ca70e76d8692e96f4a666e974592c40abc
```

The example contains two prose sections. Its document vocabulary comes from the
pinned domain library. Use the same library revision in your editor.

<<< ../../examples/first-document/FirstDocument.sysml

## 2. List and check the document

The following commands work in PowerShell and Linux shells and need no account:

```sh
doc42 list examples/first-document --library-path sysml-domain-libraries/model
doc42 check examples/first-document --library-path sysml-domain-libraries/model
```

`list` identifies `FirstDocument::overview`. `check` should report no errors.

## 3. Connect your account

Create an Elan8 account, verify your email, and activate eligible trial or paid access.
Create an API token in [your account](https://www.elan8.com/account?section=tokens), then run:

```sh
doc42 login
doc42 license
```

Paste the token at the hidden prompt. Do not put it in a command argument or commit it.
[Authentication](authentication.md) explains caching, refresh and offline use.

## 4. Build the PDF

```sh
doc42 build examples/first-document --library-path sysml-domain-libraries/model --out out
```

Open **out/FIRST-001.pdf**. Change the prose and run the build again to see the update.
The same inputs and Doc42 version produce identical PDF bytes.

Next, try [document-suite](examples.md) for requirement tables and multiple documents,
or learn how to [author your own views](authoring.md).
