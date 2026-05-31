def upload_to_ipfs(file_bytes: bytes) -> str:
    import hashlib
    return "ipfs_" + hashlib.sha256(file_bytes).hexdigest()[:20]