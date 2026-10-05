from typing import Optional
from fastapi import HTTPException, status
from app.database.supabase import get_supabase_admin
from app.core.security import create_access_token
from app.utils.ticket_generator import hash_password, verify_password
from app.schemas.user import UserRegisterRequest, UserLoginRequest


def _build_user_payload(profile: dict) -> dict:
    return {
        "sub": profile["id"],
        "email": profile["email"],
        "role": profile.get("role", "student"),
        "full_name": profile.get("full_name", ""),
    }


async def register_user(data: UserRegisterRequest) -> dict:
    db = get_supabase_admin()

    # Check if email already exists
    existing = db.table("profiles").select("id").eq("email", data.email).execute()
    if existing.data:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    # Hash password
    hashed_pw = hash_password(data.password)

    # Create profile
    user_id = __import__("uuid").uuid4().__str__()
    profile_data = {
        "id": user_id,
        "email": data.email,
        "full_name": data.full_name,
        "phone": data.phone,
        "college_id": data.college_id,
        "role": data.role.value,
        "password_hash": hashed_pw,
    }

    result = db.table("profiles").insert(profile_data).execute()
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create account",
        )

    profile = result.data[0]
    token = create_access_token(_build_user_payload(profile))

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": profile["id"],
            "full_name": profile.get("full_name"),
            "email": profile["email"],
            "phone": profile.get("phone"),
            "college_id": profile.get("college_id"),
            "role": profile.get("role"),
            "profile_image": profile.get("profile_image"),
            "created_at": profile.get("created_at"),
            "updated_at": profile.get("updated_at"),
        },
    }


async def login_user(data: UserLoginRequest) -> dict:
    db = get_supabase_admin()

    result = db.table("profiles").select("*").eq("email", data.email).execute()
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    profile = result.data[0]
    if not verify_password(data.password, profile.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(_build_user_payload(profile))

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": profile["id"],
            "full_name": profile.get("full_name"),
            "email": profile["email"],
            "phone": profile.get("phone"),
            "college_id": profile.get("college_id"),
            "role": profile.get("role"),
            "profile_image": profile.get("profile_image"),
            "created_at": profile.get("created_at"),
            "updated_at": profile.get("updated_at"),
        },
    }


async def get_user_profile(user_id: str) -> dict:
    db = get_supabase_admin()
    result = db.table("profiles").select("*").eq("id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")

    profile = result.data[0]
    profile.pop("password_hash", None)
    return profile


async def update_user_profile(user_id: str, update_data: dict) -> dict:
    db = get_supabase_admin()
    update_data["updated_at"] = "now()"

    result = db.table("profiles").update(update_data).eq("id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")

    profile = result.data[0]
    profile.pop("password_hash", None)
    return profile
