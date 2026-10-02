try:
    from app.services.compression_service import COMPRESSION # type: ignore
except ImportError:
    def compress_file(*args, **kwargs):
        raise NotImplementedError("compress_file is not available in app.services.compression_service")
    COMPRESSION = {}

def test_compression_modes():
    assert set(COMPRESSION) == {"low", "mid", "high"}
