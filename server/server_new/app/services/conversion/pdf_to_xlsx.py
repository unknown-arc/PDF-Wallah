from pathlib import Path


def pdf_to_xlsx(input_path: Path, output_path: Path) -> Path:
    try:
        import pdfplumber
        from openpyxl import Workbook
    except ImportError as exc:
        raise RuntimeError("pdfplumber and openpyxl are required for PDF to XLSX conversion") from exc

    workbook = Workbook()
    default = workbook.active
    workbook.remove(default)

    with pdfplumber.open(str(input_path)) as pdf:
        for page_number, page in enumerate(pdf.pages, start=1):
            sheet = workbook.create_sheet(f"Page {page_number}")
            tables = page.extract_tables() or []
            if tables:
                for table in tables:
                    for row in table:
                        sheet.append([cell if cell is not None else "" for cell in row])
                    sheet.append([])
            else:
                text = page.extract_text() or ""
                for line in text.splitlines():
                    sheet.append([line])

    workbook.save(output_path)
    return output_path
