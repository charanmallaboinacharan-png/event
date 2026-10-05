import uuid
import secrets
import bcrypt

def hash_password(password: str) -> str:
    """Hash password using bcrypt directly."""
    pw_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pw_bytes, salt).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against bcrypt hash."""
    try:
        pw_bytes = plain_password.encode('utf-8')[:72]
        hash_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(pw_bytes, hash_bytes)
    except Exception:
        return False


def generate_ticket_code() -> str:
    """Generate a human-readable ticket code like EVT-A1B2C3D4."""
    random_part = secrets.token_hex(4).upper()
    return f"EVT-{random_part}"


def generate_qr_token() -> str:
    """Generate a secure random token for QR codes."""
    return secrets.token_urlsafe(32)


def generate_uuid() -> str:
    return str(uuid.uuid4())
