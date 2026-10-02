# PDF Wallah Backend v2

Current MVP: OCR, compression and conversion.

## Important
Use the current PyMuPDF package and import:

    import pymupdf

Do NOT use `import fitz`.

## Windows
If PowerShell activation is blocked, activation is not required:

    .\venv\Scripts\python.exe -m pip install -r requirements.txt
    .\venv\Scripts\python.exe run.py

Swagger: http://127.0.0.1:8000/docs

### Compression
    curl.exe -X POST "http://127.0.0.1:8000/api/compression" `
      -F "file=@G:\\PRO_Collab\\PDF-Wallah\\test.pdf" `
      -F "mode=mid" -o compressed.pdf

### OCR
    curl.exe -X POST "http://127.0.0.1:8000/api/ocr" `
      -F "file=@G:\\PRO_Collab\\PDF-Wallah\\test.pdf" `
      -F "level=mid" -o ocr_result.pdf

### PDF -> TXT
    curl.exe -X POST "http://127.0.0.1:8000/api/conversion/pdf-to" `
      -F "file=@G:\\PRO_Collab\\PDF-Wallah\\test.pdf" `
      -F "output_format=txt" -o converted.txt
