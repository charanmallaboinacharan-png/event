from fastapi import HTTPException, status
from datetime import datetime, timezone
from app.database.supabase import get_supabase_admin
from app.schemas.checkin import CheckInRequest


async def process_checkin(ticket_code: str, organizer_id: str, event_id: str = None) -> dict:
    db = get_supabase_admin()

    # Find ticket by code or qr_token
    ticket_result = (
        db.table("tickets")
        .select("*")
        .or_(f"ticket_code.eq.{ticket_code},qr_token.eq.{ticket_code}")
        .execute()
    )

    if not ticket_result.data:
        return {
            "success": False,
            "status": "invalid",
            "message": "Invalid ticket. No ticket found with this code.",
            "participant": None,
        }

    ticket = ticket_result.data[0]

    # Check ticket status
    if ticket["status"] == "cancelled":
        return {
            "success": False,
            "status": "invalid",
            "message": "This ticket has been cancelled.",
            "participant": None,
        }

    # Get registration
    reg_result = (
        db.table("registrations")
        .select("*")
        .eq("id", ticket["registration_id"])
        .execute()
    )
    if not reg_result.data:
        return {
            "success": False,
            "status": "invalid",
            "message": "Invalid ticket: registration not found.",
            "participant": None,
        }

    registration = reg_result.data[0]

    # If event_id provided, verify it matches
    if event_id and registration["event_id"] != event_id:
        return {
            "success": False,
            "status": "invalid",
            "message": "This ticket does not belong to this event.",
            "participant": None,
        }

    # Verify organizer owns this event
    event_result = (
        db.table("events")
        .select("organizer_id, title")
        .eq("id", registration["event_id"])
        .execute()
    )
    if not event_result.data:
        return {
            "success": False,
            "status": "invalid",
            "message": "Event not found.",
            "participant": None,
        }

    event = event_result.data[0]
    if event["organizer_id"] != organizer_id:
        return {
            "success": False,
            "status": "not_authorized",
            "message": "You are not authorized to check in participants for this event.",
            "participant": None,
        }

    # Check if already checked in
    if registration["checked_in"]:
        user_result = (
            db.table("profiles")
            .select("full_name, email, college_id")
            .eq("id", registration["user_id"])
            .execute()
        )
        user = user_result.data[0] if user_result.data else {}
        return {
            "success": False,
            "status": "already_checked_in",
            "message": "This ticket has already been used. Duplicate check-in rejected.",
            "participant": {
                "name": user.get("full_name"),
                "email": user.get("email"),
                "college_id": user.get("college_id"),
                "ticket_id": ticket["ticket_code"],
            },
            "checked_in_at": registration.get("checked_in_at"),
        }

    # Valid check-in — process it
    now = datetime.now(timezone.utc).isoformat()

    # Update registration
    db.table("registrations").update({
        "checked_in": True,
        "checked_in_at": now,
    }).eq("id", registration["id"]).execute()

    # Mark ticket as used
    db.table("tickets").update({"status": "used"}).eq("id", ticket["id"]).execute()

    # Create checkin record
    import uuid
    db.table("checkins").insert({
        "id": str(uuid.uuid4()),
        "registration_id": registration["id"],
        "event_id": registration["event_id"],
        "user_id": registration["user_id"],
        "checked_in_by": organizer_id,
        "checked_in_at": now,
        "scan_result": "success",
    }).execute()

    # Get participant info
    user_result = (
        db.table("profiles")
        .select("full_name, email, college_id")
        .eq("id", registration["user_id"])
        .execute()
    )
    user = user_result.data[0] if user_result.data else {}

    # Notify user
    try:
        db.table("notifications").insert({
            "user_id": registration["user_id"],
            "title": "Check-in Successful! ✅",
            "message": f"You have been checked in to {event['title']}.",
            "type": "checkin",
            "is_read": False,
        }).execute()
    except Exception:
        pass

    return {
        "success": True,
        "status": "checked_in",
        "message": "Check-in successful!",
        "participant": {
            "name": user.get("full_name"),
            "email": user.get("email"),
            "college_id": user.get("college_id"),
            "ticket_id": ticket["ticket_code"],
        },
        "checked_in_at": now,
    }


async def get_event_participants(event_id: str, organizer_id: str) -> list:
    db = get_supabase_admin()

    # Verify organizer owns event
    event_result = db.table("events").select("organizer_id").eq("id", event_id).execute()
    if not event_result.data or event_result.data[0]["organizer_id"] != organizer_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    reg_result = (
        db.table("registrations")
        .select("*")
        .eq("event_id", event_id)
        .order("registered_at", desc=True)
        .execute()
    )
    registrations = reg_result.data or []

    enriched = []
    for reg in registrations:
        user_result = (
            db.table("profiles")
            .select("full_name, email, college_id, phone")
            .eq("id", reg["user_id"])
            .execute()
        )
        user = user_result.data[0] if user_result.data else {}

        ticket_result = (
            db.table("tickets")
            .select("ticket_code, status")
            .eq("registration_id", reg["id"])
            .execute()
        )
        ticket = ticket_result.data[0] if ticket_result.data else {}

        enriched.append({
            **reg,
            "user": user,
            "ticket": ticket,
            "participant_name": user.get("full_name") or "Student Attendee",
            "email": user.get("email"),
            "college_id": user.get("college_id"),
            "phone": user.get("phone"),
            "ticket_code": ticket.get("ticket_code"),
            "ticket_status": ticket.get("status"),
        })

    return enriched
