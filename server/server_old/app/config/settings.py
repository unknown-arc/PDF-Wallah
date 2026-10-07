import os

APP_NAME = os.getenv("APP_NAME", "PDF Wallah Backend")
MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", "100"))
