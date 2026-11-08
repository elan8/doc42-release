# Releasing

## Repository convention

Each closed-source Elan8 tool has two repositories:

| Repository | Visibility | Holds |
| --- | --- | --- |
| `elan8/<tool>`, e.g. `elan8/doc42` | private | the source, its tests and its development |
| `elan8/<tool>-release`, e.g. `elan8/doc42-release` | public | the release archives, a GitHub Action that installs the tool, user documentation and the end-user license |

The release repository is how users get the tool, locally or in CI, so its name
says what it is rather than how it is used. The source repository's tag
`v<version>` and the release repository's tag `v<version>` name the same version.
Run42 and later tools follow the same pattern.

## Releasing Doc42

1. In `elan8/doc42`, on the `main` commit to release:
   - Regenerate `THIRD_PARTY_LICENSES.md` with
     `cargo about generate --locked -m crates/doc42-cli/Cargo.toml about.hbs`
     and merge it.
   - Run `cargo fmt --all --check`, `cargo clippy --workspace --all-targets --locked -- -D warnings`
     and `cargo test --workspace --locked`.
2. Tag `v<version>` on that commit and push the tag. The tag runs the release workflow
   (`.github/workflows/release.yml`), which can also be started by hand. It:
   - refuses a tag that does not match the version in `Cargo.toml`;
   - runs fmt, clippy and the test suite on Linux;
   - builds **Linux x64** on Ubuntu 22.04, so the executable needs glibc 2.35 at most, and
     refuses a newer glibc or an unlicensed development build;
   - builds **Windows x64** natively on a Windows runner for `x86_64-pc-windows-msvc`, with the
     C runtime linked statically, so `doc42.exe` needs only DLLs that ship with Windows;
   - builds real documents with each executable, using the `ELAN8_LICENSE` repository secret
     (a CI license; renew it before it expires);
   - packages `doc42-<version>-linux-x64.tar.gz` (`doc42`) and
     `doc42-<version>-windows-x64.zip` (`doc42.exe`), each with this repository's `LICENSE.md`
     and the source's `THIRD_PARTY_NOTICES.md` and `THIRD_PARTY_LICENSES.md`, and writes
     `SHA256SUMS.txt` over both archives.

   The build fetches `elan8-license` from the private `elan8-backend` repository with the
   `ELAN8_BACKEND_READ_TOKEN` repository secret.
3. Download the three release files from the run's `doc42-<version>-release` artifact:
   `gh run download <run-id> -R elan8/doc42 -n doc42-<version>-release`.
4. In this repository, set the `version` default in `action.yml` and the versions in
   `README.md`. Bring `docs/` and `examples/` up to date with the source's `docs/` and
   `examples/`, leaving out what only concerns developing Doc42 (building from source,
   contributor checks), and rebuild every sample with the new executable. Merge.
5. Create the release `v<version>` here on that `main` commit, with the three files and
   release notes that name the Spec42 version Doc42 is built with.
