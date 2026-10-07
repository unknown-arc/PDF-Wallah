from fastapi import FastAPI
from app.api.ocr import router as ocr_router
from app.api.compression import router as compression_router
from app.api.conversion import pdf_to_router, to_pdf_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title='PDF Wallah Backend', version='2.0.0')
app.include_router(ocr_router, prefix='/api')
app.include_router(compression_router, prefix='/api')
app.include_router(pdf_to_router, prefix='/api/conversion')
app.include_router(to_pdf_router, prefix='/api/conversion')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://pdf-wallah-murex.vercel.app",
                   "http://127.0.0.1/",
                   "http://localhost:3000",],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def root():
    return {'message': 'PDF Wallah Backend is running'}

@app.get('/health')
def health():
    return {'status': 'ok'}
