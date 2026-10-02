from pathlib import Path
from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask
from app.services.conversion_service import convert_pdf, convert_to_pdf
from app.utils.file_handler import save_upload, validate_pdf
from app.utils.cleanup import cleanup_file

router = APIRouter()

@router.post('/conversion/pdf-to')
async def pdf_to(file: UploadFile = File(...), output_format: str = Form(...)):
    validate_pdf(file)
    output_format = output_format.lower().strip()
    if output_format not in {'txt', 'png', 'jpg', 'jpeg'}:
        raise HTTPException(status_code=400, detail='Supported formats: txt, png, jpg, jpeg')
    input_path = await save_upload(file)
    output_path = input_path.with_name(f'{input_path.stem}_converted')
    try:
        result_path = convert_pdf(input_path, output_path, output_format)
        media = 'text/plain' if output_format == 'txt' else 'application/zip'
        filename = 'converted.txt' if output_format == 'txt' else f'converted_{output_format}.zip'
        return FileResponse(result_path, media_type=media, filename=filename,
                            background=BackgroundTask(cleanup_file, input_path, result_path))
    except Exception as exc:
        cleanup_file(input_path, output_path, output_path.with_suffix('.zip'))
        raise HTTPException(status_code=500, detail=f'Conversion failed: {exc}')

@router.post('/conversion/to-pdf')
async def to_pdf(file: UploadFile = File(...)):
    ext = Path(file.filename or '').suffix.lower().lstrip('.')
    if ext not in {'png', 'jpg', 'jpeg', 'txt'}:
        raise HTTPException(status_code=400, detail='Supported inputs: png, jpg, jpeg, txt')
    input_path = await save_upload(file)
    output_path = input_path.with_suffix('.pdf')
    try:
        convert_to_pdf(input_path, output_path, ext)
        return FileResponse(output_path, media_type='application/pdf', filename='converted.pdf',
                            background=BackgroundTask(cleanup_file, input_path, output_path))
    except Exception as exc:
        cleanup_file(input_path, output_path)
        raise HTTPException(status_code=500, detail=f'Conversion failed: {exc}')
