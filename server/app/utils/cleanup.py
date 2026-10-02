from pathlib import Path

def cleanup_file(*paths):
    for path in paths:
        if path:
            Path(path).unlink(missing_ok=True)
