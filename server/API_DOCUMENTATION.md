# PDF Wallah — API Documentation

**Base URL**

```text
http://127.0.0.1:8000
```

---

## 1. PDF Compression

### Endpoint

```http
POST /api/compression
```

### Full URL

```text
http://127.0.0.1:8000/api/compression
```

### Body

**Content-Type:** `multipart/form-data`

| Field       | Type   | Required        | Values                         |
| ----------- | ------ | --------------- | ------------------------------ |
| `file`      | File   | Yes             | PDF file                       |
| `mode`      | String | Yes             | `low`, `mid`, `high`, `custom` |
| `target_mb` | Number | Only for custom | Target size in MB              |

### Example — Mid Compression

```text
file      = document.pdf
mode      = mid
target_mb = 
```

### Example — Custom Compression

```text
file      = document.pdf
mode      = custom
target_mb = 8
```

### Response

```text
200 OK
Content-Type: application/pdf
```

Returns:

```text
compressed.pdf
```

---

# 2. OCR

### Endpoint

```http
POST /api/ocr
```

### Full URL

```text
http://127.0.0.1:8000/api/ocr
```

### Body

**Content-Type:** `multipart/form-data`

| Field   | Type   | Required | Values               |
| ------- | ------ | -------- | -------------------- |
| `file`  | File   | Yes      | PDF file             |
| `level` | String | Yes      | `low`, `mid`, `high` |

### Example

```text
file  = scanned-document.pdf
level = mid
```

### Response

```text
200 OK
Content-Type: application/pdf
```

Returns:

```text
ocr_result.pdf
```

---

# 3. PDF → TXT

### Endpoint

```http
POST /api/conversion/pdf-to
```

### Body

**Content-Type:** `multipart/form-data`

```text
file           = document.pdf
output_format  = txt
```

### Response

```text
200 OK
Content-Type: text/plain
```

Returns:

```text
converted.txt
```

---

# 4. PDF → JPG

### Endpoint

```http
POST /api/conversion/pdf-to
```

### Body

```text
file           = document.pdf
output_format  = jpg
```

### Response

```text
200 OK
```

Returns a ZIP containing:

```text
page_1.jpg
page_2.jpg
page_3.jpg
...
```

---

# 5. PDF → PNG

### Endpoint

```http
POST /api/conversion/pdf-to
```

### Body

```text
file           = document.pdf
output_format  = png
```

### Response

```text
200 OK
```

Returns a ZIP containing:

```text
page_1.png
page_2.png
page_3.png
...
```

---

# 6. JPG → PDF

### Endpoint

```http
POST /api/conversion/to-pdf
```

### Body

**Content-Type:** `multipart/form-data`

```text
file = image.jpg
```

### Response

```text
200 OK
Content-Type: application/pdf
```

Returns:

```text
converted.pdf
```

---

# 7. PNG → PDF

### Endpoint

```http
POST /api/conversion/to-pdf
```

### Body

```text
file = image.png
```

### Response

```text
200 OK
Content-Type: application/pdf
```

Returns:

```text
converted.pdf
```

---

# 8. TXT → PDF

### Endpoint

```http
POST /api/conversion/to-pdf
```

### Body

```text
file = document.txt
```

### Response

```text
200 OK
Content-Type: application/pdf
```

Returns:

```text
converted.pdf
```

---

# Error Response

If the request fails, the API returns:

```json
{
    "detail": "Error message"
}
```

Common status codes:

```text
200 → Success
400 → Invalid request / unsupported format
413 → File too large
500 → Server processing error
```

---

# Frontend Request Summary

| Feature     | Method | Endpoint                 | Body                        |
| ----------- | ------ | ------------------------ | --------------------------- |
| Compression | POST   | `/api/compression`       | `file`, `mode`, `target_mb` |
| OCR         | POST   | `/api/ocr`               | `file`, `level`             |
| PDF → TXT   | POST   | `/api/conversion/pdf-to` | `file`, `output_format=txt` |
| PDF → JPG   | POST   | `/api/conversion/pdf-to` | `file`, `output_format=jpg` |
| PDF → PNG   | POST   | `/api/conversion/pdf-to` | `file`, `output_format=png` |
| JPG → PDF   | POST   | `/api/conversion/to-pdf` | `file`                      |
| PNG → PDF   | POST   | `/api/conversion/to-pdf` | `file`                      |
| TXT → PDF   | POST   | `/api/conversion/to-pdf` | `file`                      |

**Important:** All file-upload requests use `multipart/form-data`, not JSON.
