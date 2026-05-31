import os, hashlib
from dotenv import load_dotenv

load_dotenv()

def store_report_on_chain(anonymous_id, category, severity,
                           latitude, longitude, photo_hash) -> str:
    # Generates a deterministic mock TX hash for development
    data = f"{anonymous_id}{category}{severity}{latitude}{longitude}"
    return "0xdev_" + hashlib.sha256(data.encode()).hexdigest()[:40]