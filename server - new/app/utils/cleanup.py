from pathlib import Path


def cleanup_file(*paths):
    """
    Delete temporary files after the HTTP response is completed.
    """

    for path in paths:
        if path:
            try:
                Path(path).unlink(missing_ok=True)
            except OSError:
                pass