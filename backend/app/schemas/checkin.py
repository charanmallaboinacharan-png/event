from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CheckInRequest(BaseModel):
    ticket_code: str
    event_id: Optional[str] = None


class ParticipantInfo(BaseModel):
    name: Optional[str]
    email: Optional[str]
    college_id: Optional[str]
    ticket_id: str


class CheckInResponse(BaseModel):
    success: bool
    status: str  # checked_in | already_checked_in | invalid | not_authorized
    message: str
    participant: Optional[ParticipantInfo] = None
    checked_in_at: Optional[datetime] = None
