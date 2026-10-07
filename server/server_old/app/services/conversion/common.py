from pathlib import Path
import shutil
import subprocess


OFFICE_FORMATS = {"docx", "pptx", "xlsx"}
IMAGE_FORMATS = {"jpg", "jpeg", "png"}
PDF_TO_FORMATS = {"txt", "jpg", "jpeg", "png", "docx", "pptx", "xlsx"}
TO_PDF_FORMATS = {"txt", "jpg", "jpeg", "png", "docx", "pptx", "xlsx"}


def find_libreoffice() -> str | None:
    candidates = [
        shutil.which("libreoffice"),
        shutil.which("soffice"),
        r"C:\\Program Files\\LibreOffice\\program\\soffice.exe",
        r"C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe",
    ]
    for candidate in candidates:
        if candidate and Path(candidate).exists():
            return candidate
    return None


def office_to_pdf(input_path: Path, output_path: Path) -> Path:
    soffice = find_libreoffice()
    if not soffice:
        raise RuntimeError(
            "LibreOffice is required for DOCX/PPTX/XLSX to PDF conversion. "
            "Install LibreOffice and make sure soffice is available."
        )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    result = subprocess.run(
        [soffice, "--headless", "--convert-to", "pdf", "--outdir", str(output_path.parent), str(input_path)],
        capture_output=True,
        text=True,
        timeout=120,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip() or "LibreOffice conversion failed")

    generated = output_path.parent / f"{input_path.stem}.pdf"
    if not generated.exists():
        raise RuntimeError("LibreOffice did not create the expected PDF output")

    if generated.resolve() != output_path.resolve():
        generated.replace(output_path)
    return output_path
