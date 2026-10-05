from fastapi import APIRouter, Depends
from app.services import registration_service
from app.core.security import get_current_user

router = APIRouter(prefix="/tickets", tags=["Tickets"])


@router.get("/my", summary="Get my tickets")
async def get_my_tickets(current_user: dict = Depends(get_current_user)):
    """Get all tickets for the authenticated user with QR tokens."""
    registrations = await registration_service.get_my_registrations(
        user_id=current_user["sub"]
    )
    # Return only registrations that have tickets
    tickets = [r for r in registrations if r.get("ticket")]
    return tickets
