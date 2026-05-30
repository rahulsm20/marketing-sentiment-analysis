import os
from functools import lru_cache
from typing import Annotated

import httpx
from authlib.jose import JsonWebKey, jwt
from authlib.jose.errors import JoseError
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

load_dotenv()

_bearer = HTTPBearer()

_AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN", "")
_AUTH0_AUDIENCE = os.getenv("AUTH0_AUDIENCE", "")


@lru_cache(maxsize=1)
def _get_jwks() -> JsonWebKey:
    resp = httpx.get(f"https://{_AUTH0_DOMAIN}/.well-known/jwks.json", timeout=10)
    resp.raise_for_status()
    return JsonWebKey.import_key_set(resp.json())


def jwt_check(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(_bearer)],
) -> dict:
    """Validate Auth0 JWT. Raises 401 if missing or invalid."""
    token = credentials.credentials
    try:
        jwks = _get_jwks()
        claims = jwt.decode(
            token,
            jwks,
            claims_options={
                "aud": {"essential": True, "value": _AUTH0_AUDIENCE},
                "iss": {"essential": True, "value": f"https://{_AUTH0_DOMAIN}/"},
            },
        )
        claims.validate()
        return dict(claims)
    except JoseError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {e}")


def check_user(payload: Annotated[dict, Depends(jwt_check)]) -> dict:
    """Confirm token has a subject claim. Returns the decoded JWT payload."""
    if not payload.get("sub"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    return payload
