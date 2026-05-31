from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

EMERGENCY_CONTACTS = {
    "police":     {"number": "100", "name": "Police"},
    "ambulance":  {"number": "108", "name": "Ambulance"},
    "fire":       {"number": "101", "name": "Fire Station"},
    "disaster":   {"number": "1077", "name": "Disaster Management"},
    "women":      {"number": "1091", "name": "Women Helpline"},
    "child":      {"number": "1098", "name": "Child Helpline"},
}

class EmergencyRequest(BaseModel):
    service_type: str
    latitude: float
    longitude: float
    description: str

@router.get("/contacts")
def get_contacts():
    return EMERGENCY_CONTACTS

@router.post("/alert")
def send_alert(req: EmergencyRequest):
    contact = EMERGENCY_CONTACTS.get(req.service_type)
    if not contact:
        return {"error": "Unknown service"}
    # In production: integrate Twilio / SMS gateway here
    return {
        "message": f"Alert sent to {contact['name']}",
        "number": contact["number"],
        "location": {"lat": req.latitude, "lng": req.longitude}
    }