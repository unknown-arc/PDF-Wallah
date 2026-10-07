from pathlib import Path
import uuid
from fastapi import UploadFile, HTTPException

UPLOAD_DIR = Path('temp/uploads')
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
MAX_FILE_SIZE = 100 * 1024 * 1024

def validate_pdf(file: UploadFile):
    if not (file.filename or '').lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail='Only PDF files are accepted')

async def save_upload(file: UploadFile) -> Path:
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail='Maximum file size is 100 MB')
    suffix = Path(file.filename or 'upload.bin').suffix.lower()
    path = UPLOAD_DIR / f'{uuid.uuid4().hex}{suffix}'
    path.write_bytes(content)
    return path
