from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.services import event_service
from app.schemas.event import EventCreateRequest, EventUpdateRequest
from app.core.security import get_current_user, get_current_user_optional, require_organizer

router = APIRouter(prefix="/events", tags=["Events"])


@router.get("", summary="List all published events")
async def list_events(
    search: Optional[str] = Query(None, description="Search by title"),
    category: Optional[str] = Query(None, description="Filter by category"),
    date_from: Optional[str] = Query(None, description="Filter from date (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(None, description="Filter to date (YYYY-MM-DD)"),
    page: int = Query(1, ge=1),
    per_page: int = Query(12, ge=1, le=50),
    current_user: Optional[dict] = Depends(get_current_user_optional),
):
    """Get all published events with optional search and filters."""
    user_id = current_user["sub"] if current_user else None
    return await event_service.get_events(
        search=search,
        category=category,
        date_from=date_from,
        date_to=date_to,
        page=page,
        per_page=per_page,
        current_user_id=user_id,
    )


@router.get("/{event_id}", summary="Get event details")
async def get_event(
    event_id: str,
    current_user: Optional[dict] = Depends(get_current_user_optional),
):
    """Get details for a specific event."""
    user_id = current_user["sub"] if current_user else None
    return await event_service.get_event_by_id(event_id, current_user_id=user_id)


@router.post("", summary="Create a new event (Organizer only)")
async def create_event(
    data: EventCreateRequest,
    current_user: dict = Depends(require_organizer),
):
    """Create a new event. Only accessible by organizers."""
    return await event_service.create_event(data, organizer_id=current_user["sub"])


@router.put("/{event_id}", summary="Update an event (Organizer only)")
async def update_event(
    event_id: str,
    data: EventUpdateRequest,
    current_user: dict = Depends(require_organizer),
):
    """Update event details. Only the event's organizer can update it."""
    return await event_service.update_event(event_id, data, organizer_id=current_user["sub"])


@router.delete("/{event_id}", summary="Cancel/delete an event (Organizer only)")
async def delete_event(
    event_id: str,
    current_user: dict = Depends(require_organizer),
):
    """Cancel an event (soft delete). Only the event's organizer can cancel it."""
    return await event_service.delete_event(event_id, organizer_id=current_user["sub"])
