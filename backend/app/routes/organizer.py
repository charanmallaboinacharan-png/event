from fastapi import APIRouter, Depends
from app.services import event_service, checkin_service
from app.core.security import require_organizer
from app.database.supabase import get_supabase_admin

router = APIRouter(prefix="/organizer", tags=["Organizer"])


@router.get("/events", summary="Get organizer's events")
async def get_my_events(current_user: dict = Depends(require_organizer)):
    """Get all events created by the authenticated organizer."""
    return await event_service.get_organizer_events(organizer_id=current_user["sub"])


@router.get("/stats", summary="Get organizer dashboard statistics")
async def get_stats(current_user: dict = Depends(require_organizer)):
    """Get aggregate statistics for the organizer's dashboard."""
    db = get_supabase_admin()
    organizer_id = current_user["sub"]

    # Get all organizer events
    events_result = (
        db.table("events")
        .select("id, status")
        .eq("organizer_id", organizer_id)
        .execute()
    )
    all_events = events_result.data or []
    event_ids = [e["id"] for e in all_events]

    total_events = len(all_events)
    upcoming_events = len([e for e in all_events if e["status"] == "published"])

    total_registrations = 0
    total_checkins = 0

    for event_id in event_ids:
        reg_count = (
            db.table("registrations")
            .select("id", count="exact")
            .eq("event_id", event_id)
            .eq("registration_status", "confirmed")
            .execute()
        )
        total_registrations += reg_count.count or 0

        checkin_count = (
            db.table("registrations")
            .select("id", count="exact")
            .eq("event_id", event_id)
            .eq("checked_in", True)
            .execute()
        )
        total_checkins += checkin_count.count or 0

    attendance_percentage = (
        round((total_checkins / total_registrations) * 100)
        if total_registrations > 0
        else 0
    )

    # Recent registrations (across all events)
    recent_regs = []
    if event_ids:
        for eid in event_ids[:5]:  # limit to recent events
            regs = (
                db.table("registrations")
                .select("*")
                .eq("event_id", eid)
                .order("registered_at", desc=True)
                .limit(3)
                .execute()
            )
            for reg in (regs.data or []):
                user_r = db.table("profiles").select("full_name, email").eq("id", reg["user_id"]).execute()
                event_r = db.table("events").select("title").eq("id", reg["event_id"]).execute()
                reg["participant_name"] = user_r.data[0]["full_name"] if user_r.data else "Unknown"
                reg["event_title"] = event_r.data[0]["title"] if event_r.data else "Unknown"
                recent_regs.append(reg)

    recent_regs.sort(key=lambda x: x.get("registered_at", ""), reverse=True)

    return {
        "total_events": total_events,
        "upcoming_events": upcoming_events,
        "total_registrations": total_registrations,
        "total_checkins": total_checkins,
        "attendance_percentage": attendance_percentage,
        "recent_registrations": recent_regs[:10],
    }


@router.get("/notifications", summary="Get organizer notifications")
async def get_notifications(current_user: dict = Depends(require_organizer)):
    db = get_supabase_admin()
    result = (
        db.table("notifications")
        .select("*")
        .eq("user_id", current_user["sub"])
        .order("created_at", desc=True)
        .limit(20)
        .execute()
    )
    return result.data or []


@router.put("/notifications/{notif_id}/read", summary="Mark notification as read")
async def mark_read(notif_id: str, current_user: dict = Depends(require_organizer)):
    db = get_supabase_admin()
    db.table("notifications").update({"is_read": True}).eq("id", notif_id).eq("user_id", current_user["sub"]).execute()
    return {"success": True}
