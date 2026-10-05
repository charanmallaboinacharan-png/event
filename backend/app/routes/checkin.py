from fastapi import APIRouter, Depends
from app.services import checkin_service
from app.schemas.checkin import CheckInRequest
from app.core.security import require_organizer

router = APIRouter(prefix="/checkin", tags=["Check-in"])


@router.post("", summary="Scan QR code and check in participant")
async def checkin(
    data: CheckInRequest,
    current_user: dict = Depends(require_organizer),
):
    """
    Process a QR code scan for check-in.
    Validates the ticket, prevents duplicate check-ins, and records attendance.
    Only organizers can perform check-ins.
    """
    return await checkin_service.process_checkin(
        ticket_code=data.ticket_code,
        organizer_id=current_user["sub"],
        event_id=data.event_id,
    )


@router.get("/participants/{event_id}", summary="Get event participants (Organizer only)")
async def get_participants(
    event_id: str,
    current_user: dict = Depends(require_organizer),
):
    """Get all participants for an event with check-in status."""
    return await checkin_service.get_event_participants(
        event_id=event_id,
        organizer_id=current_user["sub"],
    )
