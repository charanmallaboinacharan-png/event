from fastapi import HTTPException, status
from datetime import datetime
from app.database.supabase import get_supabase_admin
from app.utils.ticket_generator import generate_ticket_code, generate_qr_token
from app.schemas.registration import RegistrationCreateRequest


async def register_for_event(event_id: str, user_id: str) -> dict:
    db = get_supabase_admin()

    # Verify event exists and is published
    event_result = (
        db.table("events")
        .select("*")
        .eq("id", event_id)
        .execute()
    )
    if not event_result.data:
        raise HTTPException(status_code=404, detail="Event not found")

    event = event_result.data[0]

    if event["status"] != "published":
        raise HTTPException(
            status_code=400, detail="This event is not accepting registrations"
        )

    # Check registration deadline
    deadline = datetime.fromisoformat(event["registration_deadline"].replace("Z", "+00:00"))
    if datetime.utcnow().replace(tzinfo=deadline.tzinfo) > deadline:
        raise HTTPException(
            status_code=400, detail="Registration deadline has passed"
        )

    # Check capacity
    reg_count = (
        db.table("registrations")
        .select("id", count="exact")
        .eq("event_id", event_id)
        .eq("registration_status", "confirmed")
        .execute()
    )
    if (reg_count.count or 0) >= event["capacity"]:
        raise HTTPException(status_code=400, detail="Event is at full capacity")

    # Check for duplicate registration
    existing_reg = (
        db.table("registrations")
        .select("id")
        .eq("event_id", event_id)
        .eq("user_id", user_id)
        .execute()
    )
    if existing_reg.data:
        raise HTTPException(
            status_code=409, detail="You are already registered for this event"
        )

    # Create registration
    import uuid
    registration_id = str(uuid.uuid4())
    ticket_id_str = str(uuid.uuid4())

    reg_data = {
        "id": registration_id,
        "event_id": event_id,
        "user_id": user_id,
        "ticket_id": ticket_id_str,
        "registration_status": "confirmed",
        "checked_in": False,
    }
    reg_result = db.table("registrations").insert(reg_data).execute()
    if not reg_result.data:
        raise HTTPException(status_code=500, detail="Failed to create registration")

    # Generate ticket
    ticket_code = generate_ticket_code()
    qr_token = generate_qr_token()
    ticket_id = str(uuid.uuid4())

    ticket_data = {
        "id": ticket_id,
        "registration_id": registration_id,
        "ticket_code": ticket_code,
        "qr_token": qr_token,
        "status": "active",
    }
    ticket_result = db.table("tickets").insert(ticket_data).execute()
    if not ticket_result.data:
        raise HTTPException(status_code=500, detail="Failed to generate ticket")

    # Create success notification
    try:
        db.table("notifications").insert({
            "user_id": user_id,
            "title": "Registration Successful! 🎉",
            "message": f"You are registered for {event['title']}. Your ticket code is {ticket_code}.",
            "type": "registration",
            "is_read": False,
        }).execute()
    except Exception:
        pass  # Notification failure should not block registration

    return {
        "success": True,
        "message": "Registration successful",
        "ticket_id": ticket_code,
        "registration_id": registration_id,
        "qr_token": qr_token,
        "ticket_code": ticket_code,
    }


async def get_my_registrations(user_id: str) -> list:
    db = get_supabase_admin()

    result = (
        db.table("registrations")
        .select("*")
        .eq("user_id", user_id)
        .order("registered_at", desc=True)
        .execute()
    )
    registrations = result.data or []

    enriched = []
    for reg in registrations:
        # Get event details
        event_result = (
            db.table("events")
            .select("id, title, location, event_date, start_time, end_time, image_url, status, category")
            .eq("id", reg["event_id"])
            .execute()
        )
        reg["event"] = event_result.data[0] if event_result.data else None

        # Get ticket
        ticket_result = (
            db.table("tickets")
            .select("*")
            .eq("registration_id", reg["id"])
            .execute()
        )
        reg["ticket"] = ticket_result.data[0] if ticket_result.data else None
        enriched.append(reg)

    return enriched


async def cancel_registration(registration_id: str, user_id: str) -> dict:
    db = get_supabase_admin()

    existing = (
        db.table("registrations")
        .select("*")
        .eq("id", registration_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not existing.data:
        raise HTTPException(status_code=404, detail="Registration not found")

    reg = existing.data[0]
    if reg["checked_in"]:
        raise HTTPException(
            status_code=400, detail="Cannot cancel a registration after check-in"
        )

    # Cancel registration
    db.table("registrations").update({"registration_status": "cancelled"}).eq(
        "id", registration_id
    ).execute()

    # Cancel ticket
    if reg.get("ticket_id"):
        db.table("tickets").update({"status": "cancelled"}).eq(
            "registration_id", registration_id
        ).execute()

    return {"success": True, "message": "Registration cancelled"}
