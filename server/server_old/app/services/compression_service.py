from pathlib import Path
import pymupdf

SETTINGS = {
    'low': {'dpi': 150, 'quality': 78},
    'mid': {'dpi': 120, 'quality': 65},
    'high': {'dpi': 96, 'quality': 50},
}

def _clean_save(source_path: Path, output_path: Path):
    doc = pymupdf.open(source_path)
    try:
        doc.save(output_path, garbage=4, clean=True, deflate=True,
                 deflate_images=True, deflate_fonts=True, use_objstms=1)
    finally:
        doc.close()

def _raster_compress(source_path: Path, output_path: Path, dpi: int, quality: int):
    source = pymupdf.open(source_path)
    output = pymupdf.open()
    try:
        for page in source:
            pix = page.get_pixmap(dpi=dpi, alpha=False)
            jpg = pix.tobytes('jpg', jpg_quality=quality)
            new_page = output.new_page(width=page.rect.width, height=page.rect.height)
            new_page.insert_image(new_page.rect, stream=jpg)
        output.save(output_path, garbage=4, clean=True, deflate=True,
                    deflate_images=True, use_objstms=1)
    finally:
        output.close()
        source.close()

def compress_pdf(input_path: Path, output_path: Path, mode: str, target_mb: float | None = None):
    original_size = input_path.stat().st_size
    _clean_save(input_path, output_path)
    if output_path.exists() and output_path.stat().st_size < original_size and mode == 'low':
        return

    settings = SETTINGS['mid' if mode == 'custom' else mode]
    if mode == 'custom':
        target = int((target_mb or 1) * 1024 * 1024)
        ratio = target / max(original_size, 1)
        settings = SETTINGS['low'] if ratio > .75 else SETTINGS['mid'] if ratio > .45 else SETTINGS['high']

    _raster_compress(input_path, output_path, settings['dpi'], settings['quality'])

    if mode == 'custom':
        target = int((target_mb or 1) * 1024 * 1024)
        for setting in (SETTINGS['mid'], SETTINGS['high'], {'dpi': 72, 'quality': 40}):
            if output_path.stat().st_size <= target:
                break
            trial = output_path.with_name(output_path.stem + '_trial.pdf')
            _raster_compress(input_path, trial, setting['dpi'], setting['quality'])
            if trial.stat().st_size < output_path.stat().st_size:
                trial.replace(output_path)
            else:
                trial.unlink(missing_ok=True)
