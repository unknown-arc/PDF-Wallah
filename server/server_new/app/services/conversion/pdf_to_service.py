from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import pymupdf

from .pdf_to_docx import pdf_to_docx
from .pdf_to_pptx import pdf_to_pptx
from .pdf_to_xlsx import pdf_to_xlsx


def pdf_to_txt(input_path: Path, output_path: Path) -> Path:
    doc = pymupdf.open(input_path)
    try:
        text = "\n\n".join(page.get_text() for page in doc)
        output_path.write_text(text, encoding="utf-8")
    finally:
        doc.close()
    return output_path


def pdf_to_images(input_path: Path, output_path: Path, image_format: str) -> Path:
    extension = "jpg" if image_format in {"jpg", "jpeg"} else "png"
    zip_path = output_path.with_suffix(".zip")
    doc = pymupdf.open(input_path)
    try:
        with ZipFile(zip_path, "w", ZIP_DEFLATED) as archive:
            for page_number, page in enumerate(doc, start=1):
                pix = page.get_pixmap(alpha=False)
                data = pix.tobytes("jpg" if extension == "jpg" else "png")
                archive.writestr(f"page_{page_number}.{extension}", data)
    finally:
        doc.close()
    return zip_path


def convert_pdf(input_path: Path, output_path: Path, output_format: str) -> Path:
    fmt = output_format.lower().strip()
    if fmt == "txt":
        return pdf_to_txt(input_path, output_path.with_suffix(".txt"))
    if fmt in {"jpg", "jpeg", "png"}:
        return pdf_to_images(input_path, output_path, fmt)
    if fmt == "docx":
        return pdf_to_docx(input_path, output_path.with_suffix(".docx"))
    if fmt == "pptx":
        return pdf_to_pptx(input_path, output_path.with_suffix(".pptx"))
    if fmt == "xlsx":
        return pdf_to_xlsx(input_path, output_path.with_suffix(".xlsx"))
    raise ValueError(f"Unsupported PDF output format: {fmt}")
