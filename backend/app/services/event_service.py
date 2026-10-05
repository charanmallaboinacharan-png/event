from typing import Optional, List
from fastapi import HTTPException, status
from datetime import datetime
from app.database.supabase import get_supabase_admin
from app.schemas.event import EventCreateRequest, EventUpdateRequest


async def get_events(
    search: Optional[str] = None,
    category: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    status_filter: Optional[str] = "published",
    page: int = 1,
    per_page: int = 12,
    current_user_id: Optional[str] = None,
) -> dict:
    db = get_supabase_admin()

    query = db.table("events").select(
        "*, profiles!events_organizer_id_fkey(id, full_name, email)"
    )

    if status_filter:
        query = query.eq("status", status_filter)
    if category and category != "all":
        query = query.eq("category", category)
    if date_from:
        query = query.gte("event_date", date_from)
    if date_to:
        query = query.lte("event_date", date_to)
    if search:
        query = query.ilike("title", f"%{search}%")

    query = query.order("event_date", desc=False)

    result = query.execute()
    all_events = result.data or []

    # Pagination
    total = len(all_events)
    start = (page - 1) * per_page
    end = start + per_page
    paginated = all_events[start:end]

    # Batch query registration counts for all paginated events in ONE SINGLE query
    event_ids = [e["id"] for e in paginated]
    reg_counts = {}
    user_reg_events = set()

    if event_ids:
        try:
            regs_res = (
                db.table("registrations")
                .select("event_id, user_id")
                .in_("event_id", event_ids)
                .eq("registration_status", "confirmed")
                .execute()
            )
            for r in (regs_res.data or []):
                eid = r["event_id"]
                reg_counts[eid] = reg_counts.get(eid, 0) + 1
                if current_user_id and r.get("user_id") == current_user_id:
                    user_reg_events.add(eid)
        except Exception as e:
            print("Batch registration count fetch error:", e)

    enriched = []
    for event in paginated:
        registered_count = reg_counts.get(event["id"], 0)
        available_seats = event["capacity"] - registered_count
        organizer_data = event.pop("profiles", None)
        event["organizer"] = organizer_data
        event["registered_count"] = registered_count
        event["current_registrations"] = registered_count
        event["available_seats"] = max(0, available_seats)
        event["is_registered"] = event["id"] in user_reg_events
        enriched.append(event)

    return {
        "events": enriched,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


async def get_event_by_id(event_id: str, current_user_id: Optional[str] = None) -> dict:
    db = get_supabase_admin()
    result = (
        db.table("events")
        .select("*, profiles!events_organizer_id_fkey(id, full_name, email)")
        .eq("id", event_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Event not found")

    event = result.data[0]

    reg_result = (
        db.table("registrations")
        .select("id", count="exact")
        .eq("event_id", event_id)
        .eq("registration_status", "confirmed")
        .execute()
    )
    registered_count = reg_result.count or 0
    event["registered_count"] = registered_count
    event["current_registrations"] = registered_count
    event["available_seats"] = max(0, event["capacity"] - registered_count)

    is_registered = False
    if current_user_id:
        user_reg = (
            db.table("registrations")
            .select("id")
            .eq("event_id", event_id)
            .eq("user_id", current_user_id)
            .eq("registration_status", "confirmed")
            .execute()
        )
        is_registered = bool(user_reg.data)

    organizer_data = event.pop("profiles", None)
    event["organizer"] = organizer_data
    event["is_registered"] = is_registered
    return event


async def create_event(data: EventCreateRequest, organizer_id: str) -> dict:
    db = get_supabase_admin()

    event_data = {
        "title": data.title,
        "description": data.description,
        "category": data.category.value,
        "image_url": data.image_url,
        "location": data.location,
        "event_date": data.event_date,
        "start_time": data.start_time,
        "end_time": data.end_time,
        "capacity": data.capacity,
        "registration_deadline": data.registration_deadline,
        "organizer_id": organizer_id,
        "status": data.status.value,
    }

    result = db.table("events").insert(event_data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create event")

    return result.data[0]


async def update_event(event_id: str, data: EventUpdateRequest, organizer_id: str) -> dict:
    db = get_supabase_admin()

    # Verify ownership
    existing = (
        db.table("events").select("id, organizer_id").eq("id", event_id).execute()
    )
    if not existing.data:
        raise HTTPException(status_code=404, detail="Event not found")

    event = existing.data[0]
    if event["organizer_id"] != organizer_id:
        raise HTTPException(status_code=403, detail="You are not authorized to edit this event")

    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if "category" in update_data:
        update_data["category"] = update_data["category"].value if hasattr(update_data["category"], "value") else update_data["category"]
    if "status" in update_data:
        update_data["status"] = update_data["status"].value if hasattr(update_data["status"], "value") else update_data["status"]
    update_data["updated_at"] = datetime.utcnow().isoformat()

    result = db.table("events").update(update_data).eq("id", event_id).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to update event")

    return result.data[0]


async def delete_event(event_id: str, organizer_id: str) -> dict:
    db = get_supabase_admin()

    existing = (
        db.table("events").select("id, organizer_id").eq("id", event_id).execute()
    )
    if not existing.data:
        raise HTTPException(status_code=404, detail="Event not found")

    if existing.data[0]["organizer_id"] != organizer_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Soft delete: mark as cancelled
    result = (
        db.table("events")
        .update({"status": "cancelled", "updated_at": datetime.utcnow().isoformat()})
        .eq("id", event_id)
        .execute()
    )
    return {"success": True, "message": "Event cancelled successfully"}


async def get_organizer_events(organizer_id: str) -> list:
    db = get_supabase_admin()
    result = (
        db.table("events")
        .select("*")
        .eq("organizer_id", organizer_id)
        .order("created_at", desc=True)
        .execute()
    )
    events = result.data or []

    for event in events:
        reg_result = (
            db.table("registrations")
            .select("id", count="exact")
            .eq("event_id", event["id"])
            .execute()
        )
        event["registered_count"] = reg_result.count or 0
        event["current_registrations"] = reg_result.count or 0
        checkin_result = (
            db.table("registrations")
            .select("id", count="exact")
            .eq("event_id", event["id"])
            .eq("checked_in", True)
            .execute()
        )
        event["checked_in_count"] = checkin_result.count or 0

    return events
