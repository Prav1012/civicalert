from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    anonymous_id = Column(String, nullable=False)   # hashed, no real identity
    category = Column(String)                        # pothole, fire, flood, etc.
    severity = Column(String)                        # low, medium, high, critical
    description = Column(Text)
    latitude = Column(Float)
    longitude = Column(Float)
    photo_ipfs_hash = Column(String)                 # IPFS CID, not a server URL
    blockchain_tx_hash = Column(String)              # Ethereum tx hash
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())