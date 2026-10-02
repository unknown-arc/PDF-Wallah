def test_compression_modes():
    from app.services.compression_service import COMPRESSION
    assert set(COMPRESSION) == {"low", "mid", "high"}
