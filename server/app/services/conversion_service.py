from pathlib import Path
import zipfile
import pymupdf
from PIL import Image

def convert_pdf(input_path: Path, output_base: Path, output_format: str) -> Path:
    source = pymupdf.open(input_path)
    try:
        if output_format == 'txt':
            result = output_base.with_suffix('.txt')
            parts = []
            for page in source:
                parts.append(page.get_text())
                parts.append('\n\f\n')
            result.write_text(''.join(parts), encoding='utf-8')
            return result
        result = output_base.with_suffix('.zip')
        ext = 'jpg' if output_format in {'jpg', 'jpeg'} else 'png'
        with zipfile.ZipFile(result, 'w', zipfile.ZIP_DEFLATED) as zf:
            for index, page in enumerate(source):
                pix = page.get_pixmap(dpi=150, alpha=False)
                zf.writestr(f'page_{index + 1}.{ext}', pix.tobytes(ext))
        return result
    finally:
        source.close()

def convert_to_pdf(input_path: Path, output_path: Path, extension: str):
    if extension in {'png', 'jpg', 'jpeg'}:
        with Image.open(input_path) as image:
            image.convert('RGB').save(output_path, 'PDF', resolution=150.0)
        return
    if extension == 'txt':
        text = input_path.read_text(encoding='utf-8', errors='replace')
        doc = pymupdf.open()
        try:
            lines = text.splitlines() or ['']
            page = doc.new_page(width=595, height=842)
            rect = pymupdf.Rect(40, 40, 555, 802)
            buffer = ''
            for line in lines:
                if len(buffer) + len(line) > 2500:
                    page.insert_textbox(rect, buffer, fontsize=10, lineheight=1.2)
                    page = doc.new_page(width=595, height=842)
                    buffer = ''
                buffer += line + '\n'
            page.insert_textbox(rect, buffer, fontsize=10, lineheight=1.2)
            doc.save(output_path, garbage=4, deflate=True)
        finally:
            doc.close()
        return
    raise ValueError('Unsupported input format')
