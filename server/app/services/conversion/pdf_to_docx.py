from pathlib import Path


def pdf_to_docx(input_path: Path, output_path: Path) -> Path:
    try:
        from pdf2docx import Converter
    except ImportError as exc:
        raise RuntimeError("pdf2docx is required for PDF to DOCX conversion") from exc

    converter = Converter(str(input_path))
    try:
        converter.convert(str(output_path))
    finally:
        converter.close()
    return output_path
