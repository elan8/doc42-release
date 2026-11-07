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
2. Build:
   - **Linux x64**, in an `ubuntu:22.04` container with `CARGO_TARGET_DIR=target-compat`,
     so the executable needs glibc 2.35 at most: `cargo build --release --locked -p doc42-cli`,
     then `strip`. Check with `objdump -T doc42 | grep -o 'GLIBC_[0-9.]*' | sort -Vu | tail -1`.
   - **Windows x64**, cross-compiled with MinGW:
     `CARGO_TARGET_X86_64_PC_WINDOWS_GNU_LINKER=x86_64-w64-mingw32-gcc cargo build --release --locked --target x86_64-pc-windows-gnu -p doc42-cli`,
     then `x86_64-w64-mingw32-strip`. Run the test suite as Windows binaries with
     `CARGO_TARGET_X86_64_PC_WINDOWS_GNU_RUNNER=wine`; the executable must import system DLLs only.

   The build fetches `elan8-license` from the private `elan8-backend` repository, so it
   needs GitHub credentials with read access to it.
3. Build one real document with each executable and an `ELAN8_LICENSE`.
4. Package `doc42-<version>-linux-x64.tar.gz` (`doc42`) and
   `doc42-<version>-windows-x64.zip` (`doc42.exe`), each with this repository's
   `LICENSE.md` and the source's `THIRD_PARTY_NOTICES.md` and `THIRD_PARTY_LICENSES.md`.
   Write `SHA256SUMS.txt` with `sha256sum` over both archives.
5. In this repository, set the `version` default in `action.yml` and the versions in
   `README.md`, and merge.
6. Tag `v<version>` in `elan8/doc42` and create the release `v<version>` here on that
   `main` commit, with the three files and release notes that name the Spec42
   version Doc42 is built with.
