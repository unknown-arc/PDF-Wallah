from pathlib import Path
import pymupdf
from PIL import Image

from .common import office_to_pdf


def image_to_pdf(input_path: Path, output_path: Path) -> Path:
    image = Image.open(input_path).convert("RGB")
    try:
        image.save(output_path, "PDF")
    finally:
        image.close()
    return output_path


def text_to_pdf(input_path: Path, output_path: Path) -> Path:
    text = input_path.read_text(encoding="utf-8", errors="replace")
    doc = pymupdf.open()
    try:
        lines = text.splitlines() or [""]
        page = doc.new_page()
        rect = pymupdf.Rect(50, 50, page.rect.width - 50, page.rect.height - 50)
        y = rect.y0
        line_height = 14
        for line in lines:
            if y + line_height > rect.y1:
                page = doc.new_page()
                y = rect.y0
            page.insert_text((rect.x0, y), line[:140], fontsize=10)
            y += line_height
        doc.save(output_path)
    finally:
        doc.close()
    return output_path


def convert_to_pdf(input_path: Path, output_path: Path, input_format: str) -> Path:
    fmt = input_format.lower().strip()
    if fmt in {"jpg", "jpeg", "png"}:
        return image_to_pdf(input_path, output_path)
    if fmt == "txt":
        return text_to_pdf(input_path, output_path)
    if fmt in {"docx", "pptx", "xlsx"}:
        return office_to_pdf(input_path, output_path)
    raise ValueError(f"Unsupported PDF input format: {fmt}")
