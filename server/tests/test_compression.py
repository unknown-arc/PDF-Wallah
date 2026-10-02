import pymupdf

from app.services.compression_service import compress_pdf


def test_compression_module_imports():
    assert callable(compress_pdf)


def test_compression_modes(tmp_path):
    input_path = tmp_path / "input.pdf"

    doc = pymupdf.open()
    page = doc.new_page()
    page.insert_text((72, 72), "Hello PDF Wallah")
    doc.save(input_path)
    doc.close()

    for mode in ("low", "mid", "high"):
        output_path = tmp_path / f"{mode}.pdf"

        compress_pdf(
            input_path,
            output_path,
            mode,
            None
        )

        assert output_path.exists()
        assert output_path.stat().st_size > 0

        # Confirm output is a valid PDF
        result = pymupdf.open(output_path)
        assert len(result) == 1
        result.close()