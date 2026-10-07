from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask
from app.services.ocr_service import process_ocr
from app.utils.file_handler import save_upload, validate_pdf
from app.utils.cleanup import cleanup_file

router = APIRouter()

@router.post('/ocr')
async def ocr(file: UploadFile = File(...), level: str = Form('mid')):
    validate_pdf(file)
    level = level.lower().strip()
    if level not in {'low', 'mid', 'high'}:
        raise HTTPException(status_code=400, detail='level must be low, mid or high')
    input_path = await save_upload(file)
    output_path = input_path.with_name(f'{input_path.stem}_ocr.pdf')
    try:
        process_ocr(input_path, output_path, level)
        return FileResponse(output_path, media_type='application/pdf', filename='ocr_result.pdf',
                            background=BackgroundTask(cleanup_file, input_path, output_path))
    except Exception as exc:
        cleanup_file(input_path, output_path)
        raise HTTPException(status_code=500, detail=f'OCR failed: {exc}')
