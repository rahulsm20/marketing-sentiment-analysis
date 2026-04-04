import os
from typing import Generator

from dotenv import load_dotenv
from sqlmodel import Session, create_engine

load_dotenv()

engine = create_engine(os.environ["DATABASE_URL"])


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session