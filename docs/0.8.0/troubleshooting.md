# Troubleshooting

## No API token

For Doc42 0.8, create an API token and run `doc42 login`, or set ELAN8_TOKEN from
a secret store. A signed license is not an API token.

## Token unknown, expired or revoked

Create a replacement token on your account page and sign in again. Check whether
ELAN8_TOKEN is overriding your newly saved token. Never share the token when asking
for support; provide the Doc42 version and redacted error text instead.

## Plan does not include Doc42

Review your account's access, trial or subscription. Token creation alone does
not activate a trial or grant tool access. Access ending within an hour may prevent
issuance of a new license.

## Cannot reach Elan8

Check the connection and try again. A valid cached license may keep working until
its expiry. A new computer, a new token, or an expired cache requires an online
exchange. Reconnecting does not bypass an explicit access refusal.

## Clock or signing-key error

Check your machine's date and time and install the supported Doc42 release. Release
executables accept only their built-in production trust; development trust settings
are not a production workaround.

## Elan8::Documents cannot be resolved

Install the pinned domain-library revision from [your first PDF](getting-started.md)
and pass its model directory using --library-path. Use the same library in your editor.

## No documents found

A document must be a view annotated with @Elan8::Documents::Document. Run
`doc42 list <model> --json` to inspect discovery, then `doc42 check <model> --json`
to inspect diagnostics. Use the qualified view name with --doc for multiple documents.

## Generation fails or the output is hard to read

Resolve errors from check before build. Use --strict to reject figures below the
configured minimum text size. --draft is for review, not a way to publish a clean
result from an invalid model. Review [templates](templates.md) for layout changes.
