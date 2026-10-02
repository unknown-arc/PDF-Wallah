try: 
    from app.services.ocr_service import OCR_CONFIG  # type: ignore
except ImportError:
    def process_ocr(*args, **kwargs):
        raise NotImplementedError("process_ocr is not available in app.services.ocr_service")
    OCR_CONFIG = {}

def test_ocr_module_imports():
     assert set(OCR_CONFIG) == {"low", "mid", "high"}
