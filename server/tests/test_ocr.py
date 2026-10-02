def test_ocr_module_imports():
    from app.services.ocr_service import OCR_CONFIG
    assert set(OCR_CONFIG) == {"low", "mid", "high"}
