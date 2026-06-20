from pydantic import BaseModel

class PubSubEvent(BaseModel):
    sub: str
    company: str | None = None
    category: str | None = None
    query: str | None = None
    id: str