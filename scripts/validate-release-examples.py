"""Run the public quickstart against a packaged Doc42 executable, without printing credentials."""
import argparse
import hashlib
import subprocess
import tempfile
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--doc42', required=True, help='Packaged executable to test')
    parser.add_argument('--library-path', required=True)
    parser.add_argument('--examples-root', default='examples')
    parser.add_argument('--version', default='0.7.0')
    args = parser.parse_args()
    executable = str(Path(args.doc42).resolve())
    library = str(Path(args.library_path).resolve())
    examples = Path(args.examples_root).resolve()

    def run(*arguments):
        result = subprocess.run([executable, *map(str, arguments)], capture_output=True, text=True)
        if result.returncode:
            # CLI errors redact token secrets; never print environment variables or input tokens.
            raise RuntimeError(f'Doc42 {arguments[0]} failed: {result.stderr.strip()}')
        return result.stdout

    version = run('--version').strip()
    if version != f'doc42 {args.version}':
        raise RuntimeError(f'Expected packaged doc42 {args.version}, got {version!r}')
    with tempfile.TemporaryDirectory(prefix='doc42-release-check-') as directory:
        output = Path(directory)
        for example, names in [
            ('first-document', ['FIRST-001.pdf']),
            ('document-suite', ['MON-CRS-001.pdf', 'MON-SRS-001.pdf', 'MON-TEST-001.pdf', 'MON-VR-001.pdf']),
            ('drone-srs', ['DRN-SRS-001.pdf']),
        ]:
            model = examples / example
            common = [str(model), '--library-path', library, '--cache-dir', str(output / 'cache')]
            run('list', *common)
            run('check', *common)
            target = output / example
            run('build', *common, '--all', '--out', target)
            actual = sorted(path.name for path in target.glob('*.pdf'))
            if actual != sorted(names):
                raise RuntimeError(f'{example}: expected {names}, got {actual}')
            first = {path.name: path.read_bytes() for path in target.glob('*.pdf')}
            if any(not value.startswith(b'%PDF') for value in first.values()):
                raise RuntimeError(f'{example}: invalid PDF header')
            run('build', *common, '--all', '--out', target)
            if first != {path.name: path.read_bytes() for path in target.glob('*.pdf')}:
                raise RuntimeError(f'{example}: repeated build changed PDF bytes')
            print(f'{example}: validated {len(first)} repeatable PDFs')
            for name, value in first.items():
                print(f'  {name} SHA256 {hashlib.sha256(value).hexdigest()}')


if __name__ == '__main__':
    main()
