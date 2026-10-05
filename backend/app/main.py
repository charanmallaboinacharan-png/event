import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.routes import auth, events, registrations, tickets, checkin, organizer, notifications, upload

app = FastAPI(
    title="Event Ease API",
    description="""
## Event Ease — College Event Management Platform

A full-featured API for managing college events, registrations, tickets, and QR check-ins.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Ensure static/uploads exists and mount StaticFiles
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
os.makedirs(os.path.join(static_dir, "uploads"), exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(events.router, prefix="/api")
app.include_router(registrations.router, prefix="/api")
app.include_router(tickets.router, prefix="/api")
app.include_router(checkin.router, prefix="/api")
app.include_router(organizer.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(upload.router, prefix="/api")


@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "Event Ease API is running",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "service": "Event Ease API"}


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again."},
    )
