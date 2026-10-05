from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.database.supabase import get_supabase_admin

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", summary="Get user notifications")
async def get_notifications(current_user: dict = Depends(get_current_user)):
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


@router.put("/{notif_id}/read", summary="Mark notification as read")
async def mark_read(notif_id: str, current_user: dict = Depends(get_current_user)):
    db = get_supabase_admin()
    db.table("notifications").update({"is_read": True}).eq("id", notif_id).eq(
        "user_id", current_user["sub"]
    ).execute()
    return {"success": True}


@router.put("/read-all", summary="Mark all notifications as read")
async def mark_all_read(current_user: dict = Depends(get_current_user)):
    db = get_supabase_admin()
    db.table("notifications").update({"is_read": True}).eq(
        "user_id", current_user["sub"]
    ).execute()
    return {"success": True}
