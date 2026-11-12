# Accounts, API tokens and offline use

Doc42 obtains a signed license with an Elan8 API token. Your account needs active
Doc42 access to generate PDFs and export document IR.

## Sign in on your computer

Create a token on [your account page](https://www.elan8.com/account?section=tokens),
with a name such as your computer's name. The account needs active Doc42 access.

```sh
doc42 login
doc42 license
```

The interactive prompt hides the token. Doc42 checks it online before saving it.
`license` reports the token name, source, and license and token expiry dates; never
the token secret. The saved token is shared by Elan8 tools in the user's configuration
directory (`%APPDATA%/Elan8` on Windows, `$XDG_CONFIG_HOME/elan8` or `~/.config/elan8`
on Linux). `ELAN8_CONFIG_DIR` can select another directory; keep it private.

## CI or a temporary environment

Store a token in your CI secret store and expose it as **ELAN8_TOKEN** only to the
step that needs it. This variable takes precedence over a saved token. Never echo
it, put it on the command line, or commit it. See [automation](automation.md).

## What needs internet access?

- `list`, `check`, and template operations do not require an account or license exchange.
- `login` validates the token online. `build` and `ir` obtain or reuse a signed license.
- Licenses refresh after 24 hours. If the server cannot be reached, a verified cached
  license can be used until its expiry, at most **48 hours after issuance**.
- Access expiry or token expiry can shorten that period. A confirmed refusal clears
  cached access; it is not treated as a network outage.
- Your model and document content are not sent to Elan8.

## Sign out or revoke a token

```sh
doc42 logout
```

This removes the saved token and cached licenses for Elan8 tools on this computer.
It does not revoke the token at the server and cannot unset ELAN8_TOKEN in the
parent shell. Remove that variable yourself if set. Revoke the token from your
account page if it is no longer needed or was exposed. Already issued licenses
may remain usable until expiry, at most 48 hours after issuance.
