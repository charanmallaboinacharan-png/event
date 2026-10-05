from fastapi import APIRouter, Depends, HTTPException
from app.schemas.user import (
    UserRegisterRequest,
    UserLoginRequest,
    UserProfileUpdate,
    ForgotPasswordRequest,
)
from app.services import auth_service
from app.core.security import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", summary="Register a new account")
async def register(data: UserRegisterRequest):
    """
    Register as a student or organizer.
    Returns an access token and user profile.
    """
    return await auth_service.register_user(data)


@router.post("/login", summary="Login to your account")
async def login(data: UserLoginRequest):
    """
    Login with email and password.
    Returns an access token and user profile.
    """
    return await auth_service.login_user(data)


@router.get("/me", summary="Get current user profile")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Returns the profile of the currently authenticated user."""
    return await auth_service.get_user_profile(current_user["sub"])


@router.put("/me", summary="Update current user profile")
async def update_me(
    data: UserProfileUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update the currently authenticated user's profile."""
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    return await auth_service.update_user_profile(current_user["sub"], update_data)


@router.post("/logout", summary="Logout")
async def logout():
    """Client-side logout — invalidate token on the client."""
    return {"success": True, "message": "Logged out successfully"}
