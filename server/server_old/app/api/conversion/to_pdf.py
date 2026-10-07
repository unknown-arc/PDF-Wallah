from pathlib import Path
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask

from app.services.conversion.to_pdf_service import convert_to_pdf
from app.utils.file_handler import save_upload
from app.utils.cleanup import cleanup_file

router = APIRouter()
SUPPORTED = {"txt", "png", "jpg", "jpeg", "docx", "pptx", "xlsx"}


@router.post("/to-pdf")
async def to_pdf(file: UploadFile = File(...)):
    ext = Path(file.filename or "").suffix.lower().lstrip(".")
    if ext not in SUPPORTED:
        raise HTTPException(status_code=400, detail="Supported inputs: txt, png, jpg, jpeg, docx, pptx, xlsx")

    input_path = await save_upload(file)
    output_path = input_path.with_suffix(".pdf")

    try:
        result_path = convert_to_pdf(input_path, output_path, ext)
        return FileResponse(
            result_path,
            media_type="application/pdf",
            filename="converted.pdf",
            background=BackgroundTask(cleanup_file, input_path, result_path),
        )
    except Exception as exc:
        cleanup_file(input_path, output_path)
        raise HTTPException(status_code=500, detail=f"Conversion failed: {exc}")
