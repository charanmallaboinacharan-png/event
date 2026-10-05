from fastapi import APIRouter, Depends
from app.services import registration_service
from app.schemas.registration import RegistrationCreateRequest
from app.core.security import get_current_user

router = APIRouter(prefix="/registrations", tags=["Registrations"])


@router.post("", summary="Register for an event")
async def register_for_event(
    data: RegistrationCreateRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Register the authenticated student for an event.
    Creates a registration record and generates a ticket with QR code.
    """
    return await registration_service.register_for_event(
        event_id=data.event_id,
        user_id=current_user["sub"],
    )


@router.get("/my", summary="Get my registrations")
async def get_my_registrations(
    current_user: dict = Depends(get_current_user),
):
    """Get all registrations for the currently authenticated user."""
    return await registration_service.get_my_registrations(user_id=current_user["sub"])


@router.delete("/{registration_id}", summary="Cancel a registration")
async def cancel_registration(
    registration_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Cancel a registration. Cannot cancel after check-in."""
    return await registration_service.cancel_registration(
        registration_id=registration_id,
        user_id=current_user["sub"],
    )
