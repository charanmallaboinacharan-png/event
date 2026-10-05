import os
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.core.security import require_organizer

router = APIRouter(prefix="/upload", tags=["Upload"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("", summary="Upload an event banner image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(require_organizer),
):
    """
    Upload an event banner image (JPEG, PNG, WebP, GIF, SVG).
    Returns the public URL to access the uploaded file.
    """
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format. Please upload an image ({', '.join(ALLOWED_EXTENSIONS)}).",
        )

    # Generate a unique safe filename
    unique_filename = f"{uuid.uuid4().hex[:12]}_{file.filename.replace(' ', '_')}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to save uploaded file.")
    finally:
        await file.close()

    # Return relative or full URL
    file_url = f"http://localhost:8000/static/uploads/{unique_filename}"
    return {
        "success": True,
        "url": file_url,
        "filename": unique_filename,
    }
