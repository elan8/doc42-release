# Install Doc42

These instructions target **Doc42 0.8.0**. Download the matching archive and
`SHA256SUMS.txt` from [releases](https://github.com/elan8/doc42-release/releases).

## Windows x64

Check the ZIP hash against the published checksums, extract it, and add the directory
containing `doc42.exe` to PATH. No additional Visual C++ runtime is needed.

```powershell
Get-FileHash doc42-0.8.0-windows-x64.zip -Algorithm SHA256
Expand-Archive doc42-0.8.0-windows-x64.zip -DestinationPath doc42
./doc42/doc42.exe --version
```

## Linux x64

Requires glibc 2.35 or later, such as Ubuntu 22.04. Check and extract the archive:

```sh
sha256sum --check --ignore-missing SHA256SUMS.txt
tar -xzf doc42-0.8.0-linux-x64.tar.gz
./doc42 --version
```

Put the executable on PATH. macOS packages are not published.
Continue with [your first PDF](getting-started.md). Installing the VS Code extension
is optional; Spec42 provides model editing and the same engine is embedded in Doc42.
