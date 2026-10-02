from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask
from app.services.compression_service import compress_pdf
from app.utils.file_handler import save_upload, validate_pdf
from app.utils.cleanup import cleanup_file

router = APIRouter()

@router.post('/compression')
async def compression(file: UploadFile = File(...), mode: str = Form('mid'), target_mb: float | None = Form(None)):
    validate_pdf(file)
    mode = mode.lower().strip()
    if mode not in {'low', 'mid', 'high', 'custom'}:
        raise HTTPException(status_code=400, detail='mode must be low, mid, high or custom')
    if mode == 'custom' and (target_mb is None or target_mb <= 0):
        raise HTTPException(status_code=400, detail='target_mb is required for custom compression')

    input_path = await save_upload(file)
    output_path = input_path.with_name(f'{input_path.stem}_compressed.pdf')
    try:
        compress_pdf(input_path, output_path, mode, target_mb)
        return FileResponse(output_path, media_type='application/pdf', filename='compressed.pdf',
                            background=BackgroundTask(cleanup_file, input_path, output_path))
    except Exception as exc:
        cleanup_file(input_path, output_path)
        raise HTTPException(status_code=500, detail=f'Compression failed: {exc}')
