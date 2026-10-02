from fastapi import FastAPI
from app.api.ocr import router as ocr_router
from app.api.compression import router as compression_router
from app.api.conversion import router as conversion_router

app = FastAPI(title='PDF Wallah Backend', version='2.0.0')
app.include_router(ocr_router, prefix='/api')
app.include_router(compression_router, prefix='/api')
app.include_router(conversion_router, prefix='/api')

@app.get('/')
def root():
    return {'message': 'PDF Wallah Backend is running'}

@app.get('/health')
def health():
    return {'status': 'ok'}
