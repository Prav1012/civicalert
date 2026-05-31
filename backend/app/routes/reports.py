from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.report import Report
from app.services.ipfs_service import upload_to_ipfs
from app.services.blockchain_service import store_report_on_chain
from app.utils.anonymize import generate_anonymous_id

router = APIRouter()

@router.post("/submit")
async def submit_report(
    category: str = Form(...),
    severity: str = Form(...),
    description: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    photo: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    anonymous_id = generate_anonymous_id()

    photo_hash = None
    if photo:
        photo_bytes = await photo.read()
        photo_hash = upload_to_ipfs(photo_bytes)

    tx_hash = store_report_on_chain(
        anonymous_id=anonymous_id,
        category=category,
        severity=severity,
        latitude=latitude,
        longitude=longitude,
        photo_hash=photo_hash or ""
    )

    report = Report(
        anonymous_id=anonymous_id,
        category=category,
        severity=severity,
        description=description,
        latitude=latitude,
        longitude=longitude,
        photo_ipfs_hash=photo_hash,
        blockchain_tx_hash=tx_hash
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return {"report_id": report.id, "tx_hash": tx_hash, "status": "submitted"}


@router.get("/all")
def get_all_reports(db: Session = Depends(get_db)):
    reports = db.query(Report).order_by(Report.created_at.desc()).all()
    return reports