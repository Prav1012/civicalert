import uuid, hashlib, secrets

def generate_anonymous_id() -> str:
    salt  = secrets.token_hex(16)
    token = str(uuid.uuid4())
    return hashlib.sha256(f"{salt}{token}".encode()).hexdigest()