from pathlib import Path
import pymupdf
import pytesseract
from PIL import Image

OCR_SETTINGS = {
    'low': {'dpi': 140, 'psm': 6},
    'mid': {'dpi': 200, 'psm': 6},
    'high': {'dpi': 300, 'psm': 3},
}

def process_ocr(input_path: Path, output_path: Path, level: str):
    s = OCR_SETTINGS[level]
    source = pymupdf.open(input_path)
    output = pymupdf.open()
    try:
        for page in source:
            matrix = pymupdf.Matrix(s['dpi'] / 72, s['dpi'] / 72)
            pix = page.get_pixmap(matrix=matrix, alpha=False)
            image = Image.frombytes('RGB', [pix.width, pix.height], pix.samples)
            data = pytesseract.image_to_data(image, config=f"--psm {s['psm']}",
                                             output_type=pytesseract.Output.DICT)
            new_page = output.new_page(width=page.rect.width, height=page.rect.height)
            new_page.show_pdf_page(new_page.rect, source, page.number)
            sx, sy = page.rect.width / pix.width, page.rect.height / pix.height
            for i, raw in enumerate(data['text']):
                text = raw.strip()
                if not text:
                    continue
                try:
                    conf = float(data['conf'][i])
                except (ValueError, TypeError):
                    conf = 0
                if conf < 20:
                    continue
                x = float(data['left'][i]) * sx
                y = float(data['top'][i]) * sy
                w = float(data['width'][i]) * sx
                h = float(data['height'][i]) * sy
                new_page.insert_textbox(pymupdf.Rect(x, y, x + w, y + h), text,
                                        fontsize=max(1, min(12, h * .85)),
                                        color=(0, 0, 0), render_mode=3)
        output.save(output_path, garbage=4, clean=True, deflate=True, use_objstms=1)
    finally:
        output.close()
        source.close()
