import pymupdf

from app.services.conversion_service import convert_pdf, convert_to_pdf


def test_conversion_module_imports():
    assert callable(convert_pdf)
    assert callable(convert_to_pdf)


def test_pdf_to_txt(tmp_path):
    input_path = tmp_path / "input.pdf"
    output_path = tmp_path / "converted"

    doc = pymupdf.open()
    page = doc.new_page()
    page.insert_text((72, 72), "Hello PDF Wallah")
    doc.save(input_path)
    doc.close()

    result = convert_pdf(input_path, output_path, "txt")

    assert result.exists()
    assert result.suffix == ".txt"
    assert result.stat().st_size > 0


def test_txt_to_pdf(tmp_path):
    input_path = tmp_path / "input.txt"
    output_path = tmp_path / "output.pdf"

    input_path.write_text("Hello PDF Wallah", encoding="utf-8")

    convert_to_pdf(input_path, output_path, "txt")

    assert output_path.exists()
    assert output_path.stat().st_size > 0

    doc = pymupdf.open(output_path)
    assert len(doc) >= 1
    doc.close()