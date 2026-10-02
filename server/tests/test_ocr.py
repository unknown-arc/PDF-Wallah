from pathlib import Path

from app.services.ocr_service import OCR_SETTINGS, process_ocr


def test_ocr_module_imports():
    assert callable(process_ocr)


def test_ocr_settings():
    assert set(OCR_SETTINGS) == {"low", "mid", "high"}


def test_ocr_output_is_created(tmp_path):
    input_path = tmp_path / "input.pdf"
    output_path = tmp_path / "output.pdf"

    # Create a simple PDF for testing
    import pymupdf

    doc = pymupdf.open()
    page = doc.new_page()
    page.insert_text((72, 72), "Hello PDF Wallah")
    doc.save(input_path)
    doc.close()

    process_ocr(input_path, output_path, "low")

    assert output_path.exists()
    assert output_path.stat().st_size > 0

    # Confirm the output is a valid PDF
    result = pymupdf.open(output_path)
    assert len(result) == 1
    result.close()