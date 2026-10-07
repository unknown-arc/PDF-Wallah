# PDF Wallah Conversion Upgrade

## Replace

Remove the old single-file conversion API/service and use the new package:

- `app/api/conversion/`
- `app/services/conversion/`

## main.py

Replace the old conversion router imports with:

```python
from app.api.conversion import pdf_to_router, to_pdf_router

app.include_router(pdf_to_router, prefix="/api/conversion")
app.include_router(to_pdf_router, prefix="/api/conversion")
```

Do not also include the old `app.api.conversion` router.

## Dependencies

Add the contents of `requirements-conversion.txt` to `requirements.txt`.

## Office → PDF

DOCX, PPTX and XLSX to PDF require LibreOffice installed on the machine/server.

The service checks for `libreoffice`, `soffice`, and the standard Windows LibreOffice installation paths.

## API

### PDF → Office

`POST /api/conversion/pdf-to`

Multipart fields:

- `file`: PDF
- `output_format`: `docx`, `pptx`, or `xlsx`

### PDF → existing formats

The same endpoint supports `txt`, `jpg`, `jpeg`, and `png`.

### Office/image/text → PDF

`POST /api/conversion/to-pdf`

Upload a `.docx`, `.pptx`, `.xlsx`, `.txt`, `.jpg`, `.jpeg`, or `.png` file.

### Important limitation

PDF → PPTX creates one image-based slide per PDF page. This preserves the page appearance but does not make the original PDF text independently editable.

PDF → XLSX extracts detected tables when possible; PDFs without tables are exported as page text.
