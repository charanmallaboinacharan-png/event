from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    student = "student"
    organizer = "organizer"
    admin = "admin"


class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str = Field(min_length=2, max_length=100)
    phone: Optional[str] = None
    college_id: Optional[str] = None
    role: UserRole = UserRole.student


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = None
    college_id: Optional[str] = None
    profile_image: Optional[str] = None


class UserProfileResponse(BaseModel):
    id: str
    full_name: Optional[str]
    email: str
    phone: Optional[str]
    college_id: Optional[str]
    role: str
    profile_image: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfileResponse


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=6)
