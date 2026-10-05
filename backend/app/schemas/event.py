from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date, time
from enum import Enum


class EventStatus(str, Enum):
    draft = "draft"
    published = "published"
    cancelled = "cancelled"
    completed = "completed"


class EventCategory(str, Enum):
    technology = "technology"
    cultural = "cultural"
    sports = "sports"
    academic = "academic"
    workshop = "workshop"
    seminar = "seminar"
    other = "other"


class EventCreateRequest(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=10)
    category: EventCategory
    image_url: Optional[str] = None
    location: str = Field(min_length=3, max_length=300)
    event_date: str  # ISO date string
    start_time: str  # HH:MM format
    end_time: str  # HH:MM format
    capacity: int = Field(gt=0, le=10000)
    registration_deadline: str  # ISO datetime string
    status: EventStatus = EventStatus.published


class EventUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = Field(None, min_length=10)
    category: Optional[EventCategory] = None
    image_url: Optional[str] = None
    location: Optional[str] = Field(None, min_length=3, max_length=300)
    event_date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    capacity: Optional[int] = Field(None, gt=0, le=10000)
    registration_deadline: Optional[str] = None
    status: Optional[EventStatus] = None


class OrganizerInfo(BaseModel):
    id: str
    full_name: Optional[str]
    email: str


class EventResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    image_url: Optional[str]
    location: str
    event_date: str
    start_time: str
    end_time: str
    capacity: int
    registration_deadline: str
    organizer_id: str
    status: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    registered_count: Optional[int] = 0
    available_seats: Optional[int] = None
    is_registered: Optional[bool] = False
    organizer: Optional[OrganizerInfo] = None


class EventListResponse(BaseModel):
    events: List[EventResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
