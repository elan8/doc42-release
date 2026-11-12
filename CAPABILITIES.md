# Doc42 permissions

Doc42 requires an Elan8 API token for licensed operations. The shared client
obtains a signed license, verifies it locally, and requires the exact capability
listed below. Subscription names and pricing are not authorization rules in Doc42.

| Capability ID | Operations it permits |
| --- | --- |
| `doc42.generate` | `doc42 build`: generate one PDF or all PDFs, including draft builds. `doc42 ir`: export a document's intermediate representation as JSON. |

Listing documents, checking models and document definitions, listing/exporting
templates, command help, and version reporting do not require a capability.
Login, logout and license-status commands manage credentials; they grant no rights
by themselves. An explicitly marked unlicensed development build is for development
only and marks its generated documents.

## Registering Doc42 in the Elan8 catalog

1. Open **Administration → Products and permissions**.
2. Register product ID `doc42` and this capability reference.
3. Register `doc42.generate` with a description covering PDF generation and IR export.
4. Select that capability in the subscription bundles that should include Doc42.
5. Save the draft, review its impact and publish it. Existing subscribers retain
   their recorded bundle unless the administrator explicitly migrates active grants.

Capability IDs are case-sensitive and matched exactly. `doc42`, `doc42.*` and a
subscription name do not authorize generation. Unfamiliar capabilities for other
products are accepted in a valid signed license and confer no additional Doc42
permissions. A token's display name is informational and is not a repository or
machine restriction.

Catalog changes reach Doc42 at its next license refresh, normally after 24 hours.
A previously issued license can remain usable offline until its expiry, at most
48 hours after issuance and bounded by account access and API-token expiry.

The required identifier is declared in `crates/doc42-cli/src/license.rs`.
