# PDF Wallah — Backend

Backend API for **PDF Wallah**, a PDF utility platform inspired by tools such as iLovePDF.

Built with **Python + FastAPI**, the backend currently provides PDF **OCR, compression, and conversion** services.

---

## Swagger

https://pdf-wallah-rt2y.onrender.com/docs

---

## Features

### 1. OCR

Convert scanned/image-based PDFs into searchable PDFs using Tesseract OCR.

Supported levels:

* `low` — faster processing
* `mid` — balanced quality and speed
* `high` — higher OCR processing

Endpoint:

```text
POST /api/ocr
```

---

### 2. PDF Compression

Compress PDFs using predefined levels or a custom target file size.

Supported modes:

* `low`
* `mid`
* `high`
* `custom`

For custom compression, provide the target size in MB.

Endpoint:

```text
POST /api/compression
```

---

### 3. PDF Conversion

#### PDF → TXT

```text
POST /api/conversion/pdf-to
```

`output_format=txt`

#### PDF → PNG

```text
POST /api/conversion/pdf-to
```

`output_format=png`

Returns a ZIP containing the generated pages.

#### PDF → JPG

```text
POST /api/conversion/pdf-to
```

`output_format=jpg`

Returns a ZIP containing the generated pages.

#### PNG/JPG → PDF

```text
POST /api/conversion/to-pdf
```

#### TXT → PDF

```text
POST /api/conversion/to-pdf
```

---

## Tech Stack

| Component        | Technology              |
| ---------------- | ----------------------- |
| Backend          | Python                  |
| API Framework    | FastAPI                 |
| PDF Processing   | PyMuPDF                 |
| OCR              | Tesseract + pytesseract |
| Image Processing | Pillow                  |
| Testing          | pytest                  |
| Server           | Uvicorn                 |

---

## Project Structure

```text
pdf-wallah-backend/
│
├── app/
│   ├── main.py
│   │
│   ├── api/
│   │   ├── ocr.py
│   │   ├── compression.py
│   │   └── conversion.py
│   │
│   ├── services/
│   │   ├── ocr_service.py
│   │   ├── compression_service.py
│   │   └── conversion_service.py
│   │
│   ├── utils/
│   │   ├── file_handler.py
│   │   └── cleanup.py
│   │
│   └── config/
│       └── settings.py
│
├── temp/
│   ├── uploads/
│   └── outputs/
│
├── tests/
│   ├── test_ocr.py
│   ├── test_compression.py
│   └── test_conversion.py
│
├── requirements.txt
├── .env.example
├── .gitignore
├── README.md
└── run.py
```

---

## Requirements

* Python 3.10+
* Tesseract OCR
* pip
* Git

---

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd pdf-wallah-backend
```

### 2. Create virtual environment

```bash
python -m venv venv
```

### 3. Install Python dependencies

Windows:

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

### 4. Verify Tesseract

```powershell
tesseract --version
```

Tesseract must be available in the system PATH for OCR functionality.

---

## Run the Backend

```powershell
.\venv\Scripts\python.exe run.py
```

The API will run at:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Testing

The project includes automated tests for the main PDF services.

Run all tests:

```powershell
.\venv\Scripts\python.exe -m pytest -v
```

Current test status:

```text
8 passed
```

The tests cover:

* OCR service
* Compression service
* PDF conversion
* TXT conversion

---

## API Response

The backend returns the processed file directly.

Example:

```text
Frontend
   │
   │ Upload PDF
   ▼
FastAPI Backend
   │
   ├── OCR
   ├── Compression
   └── Conversion
   │
   ▼
Processed File
   │
   ▼
Frontend Download
```

No permanent file-storage service is required for the current MVP.

Temporary uploaded and generated files are removed after processing.

---

## API Endpoints

| Method | Endpoint                 | Purpose               |
| ------ | ------------------------ | --------------------- |
| POST   | `/api/ocr`               | OCR PDF               |
| POST   | `/api/compression`       | Compress PDF          |
| POST   | `/api/conversion/pdf-to` | PDF → TXT/PNG/JPG     |
| POST   | `/api/conversion/to-pdf` | TXT/PNG/JPG → PDF     |
| GET    | `/health`                | Health check          |
| GET    | `/docs`                  | Swagger documentation |

---

## Current Scope

### Implemented

* PDF OCR
* PDF compression
* PDF conversion
* Temporary file handling
* Automatic cleanup
* Automated testing
* FastAPI Swagger documentation

### Planned

Additional PDF utilities can be added later, such as:

* Merge PDF
* Split PDF
* Rotate PDF
* Watermark PDF
* Protect PDF
* Unlock PDF
* PDF editing

---

## Development

The backend follows a service-based structure:

```text
API Layer
    ↓
Service Layer
    ↓
PDF / OCR Processing
    ↓
Temporary Output
    ↓
File Response
    ↓
Cleanup
```

This keeps API routes separate from the actual PDF processing logic and makes individual features easier to test and maintain.

---

