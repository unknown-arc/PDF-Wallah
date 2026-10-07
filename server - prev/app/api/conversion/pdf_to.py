from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask

from app.services.conversion.pdf_to_service import convert_pdf
from app.utils.file_handler import save_upload, validate_pdf
from app.utils.cleanup import cleanup_file

router = APIRouter()

SUPPORTED = {"txt", "png", "jpg", "jpeg", "docx", "pptx", "xlsx"}


@router.post("/pdf-to")
async def pdf_to(file: UploadFile = File(...), output_format: str = Form(...)):
    validate_pdf(file)
    output_format = output_format.lower().strip()
    if output_format not in SUPPORTED:
        raise HTTPException(status_code=400, detail="Supported formats: txt, png, jpg, jpeg, docx, pptx, xlsx")

    input_path = await save_upload(file)
    output_path = input_path.with_name(f"{input_path.stem}_converted")

    try:
        result_path = convert_pdf(input_path, output_path, output_format)
        if result_path.suffix == ".txt":
            media = "text/plain"
        elif result_path.suffix == ".zip":
            media = "application/zip"
        elif result_path.suffix == ".docx":
            media = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        elif result_path.suffix == ".pptx":
            media = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        elif result_path.suffix == ".xlsx":
            media = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        else:
            media = "application/octet-stream"

        return FileResponse(
            result_path,
            media_type=media,
            filename=f"converted{result_path.suffix}",
            background=BackgroundTask(cleanup_file, input_path, result_path),
        )
    except Exception as exc:
        cleanup_file(input_path, output_path, output_path.with_suffix(".zip"))
        raise HTTPException(status_code=500, detail=f"Conversion failed: {exc}")
