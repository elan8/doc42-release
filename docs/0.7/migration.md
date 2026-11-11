# Migrate from 0.6 to 0.7

Doc42 0.7.0 replaces signed-license configuration with API-token authentication.
Keep the 0.6 executable and [0.6 documentation](/0.6/) together if you retain that version.

| 0.6 | 0.7 |
| --- | --- |
| Signed license in ELAN8_LICENSE | API token in ELAN8_TOKEN or saved by doc42 login |
| Manually obtain a new signed license | Signed license obtained and refreshed by the shared client |
| No login/logout commands | doc42 login, logout, and license status |

Existing signed licenses are not API tokens and cannot be pasted into login.
Create an API token on your account page, install 0.7, then run `doc42 login`.
Remove ELAN8_LICENSE from scripts and change CI secret references to ELAN8_TOKEN.
Both variables are sensitive credentials; never expose their values in build logs.

Review a generated PDF and model diagnostics when updating. Preserve the tool
version, compatible domain libraries and templates with your project baseline.
