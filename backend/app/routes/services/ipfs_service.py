# backend/app/services/ipfs_service.py
import ipfshttpclient

def upload_to_ipfs(file_bytes: bytes) -> str:
    # Connect to local IPFS node (run: ipfs daemon)
    with ipfshttpclient.connect("/ip4/127.0.0.1/tcp/5001") as client:
        result = client.add(file_bytes)
        return result["Hash"]   # returns CID like "QmXyz..."