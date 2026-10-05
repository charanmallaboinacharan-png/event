from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class RegistrationStatus(str, Enum):
    confirmed = "confirmed"
    cancelled = "cancelled"
    waitlisted = "waitlisted"


class RegistrationCreateRequest(BaseModel):
    event_id: str


class RegistrationResponse(BaseModel):
    id: str
    event_id: str
    user_id: str
    ticket_id: Optional[str]
    registration_status: str
    registered_at: Optional[datetime]
    checked_in: bool = False
    checked_in_at: Optional[datetime]
    event: Optional[dict] = None
    ticket: Optional[dict] = None


class RegistrationSuccessResponse(BaseModel):
    success: bool
    message: str
    ticket_id: Optional[str]
    registration_id: Optional[str]
    qr_token: Optional[str]
    ticket_code: Optional[str]
