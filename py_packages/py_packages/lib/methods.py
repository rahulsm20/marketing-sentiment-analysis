import datetime
from typing import Literal, Optional
import uuid
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

ConversationStatus = Literal[
    "pending", "in_progress", "completed", "scraping", "generation", "embedding"
]

from .models import (
    Conversations,
    Messages,
    PdfDocuments,
    ProductReviews,
    Products,
    Users,
)


# ---------------------------------------------------------------------------
# Products
# ---------------------------------------------------------------------------


def get_products(
    session: Session,
    query: Optional[str] = None,
    company: Optional[str] = None,
    category: Optional[str] = None,
) -> list[Products]:
    statement = select(Products).options(selectinload(Products.product_reviews))
    if query is not None:
        statement = statement.where(Products.query == query)
    if company is not None:
        statement = statement.where(Products.company == company)
    if category is not None:
        statement = statement.where(Products.category == category)
    return session.exec(statement).all()


def get_product_by_id(session: Session, product_id: uuid.UUID) -> Optional[Products]:
    return session.get(Products, product_id)


def get_product_reviews(session: Session, product_id: uuid.UUID) -> list[ProductReviews]:
    statement = select(ProductReviews).where(ProductReviews.product_id == product_id)
    return session.exec(statement).all()


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------


def get_user_by_id(session: Session, user_id: uuid.UUID) -> Optional[Users]:
    return session.get(Users, user_id)


def get_user_by_email(session: Session, email: str) -> Optional[Users]:
    statement = select(Users).where(Users.email == email)
    return session.exec(statement).first()


# ---------------------------------------------------------------------------
# Conversations
# ---------------------------------------------------------------------------


def get_conversations(
    session: Session,
    user_id: Optional[uuid.UUID] = None,
) -> list[Conversations]:
    statement = select(Conversations)
    if user_id is not None:
        statement = statement.where(Conversations.user_id == user_id)
    return session.exec(statement).all()


def get_conversation_by_id(
    session: Session, conversation_id: uuid.UUID
) -> Optional[Conversations]:
    return session.get(Conversations, conversation_id)


# ---------------------------------------------------------------------------
# Messages
# ---------------------------------------------------------------------------


def get_messages(session: Session, conversation_id: uuid.UUID) -> list[Messages]:
    statement = select(Messages).where(Messages.conversation_id == conversation_id)
    return session.exec(statement).all()


# ---------------------------------------------------------------------------
# PDF Documents
# ---------------------------------------------------------------------------


def get_pdf_documents(
    session: Session, conversation_id: uuid.UUID
) -> list[PdfDocuments]:
    statement = select(PdfDocuments).where(
        PdfDocuments.conversation_id == conversation_id
    )
    return session.exec(statement).all()


# ---------------------------------------------------------------------------
# Create / Update — Products
# ---------------------------------------------------------------------------


def create_product(
    session: Session,
    name: Optional[str] = None,
    url: Optional[str] = None,
    price: Optional[float] = None,
    query: Optional[str] = None,
    company: Optional[str] = None,
    category: Optional[str] = None,
) -> Products:
    product = Products(name=name, url=url, price=price, query=query, company=company, category=category)
    session.add(product)
    session.commit()
    session.refresh(product)
    return product


def create_product_review(
    session: Session,
    product_id: uuid.UUID,
    review_text: Optional[str] = None,
) -> ProductReviews:
    review = ProductReviews(product_id=product_id, review_text=review_text)
    session.add(review)
    session.commit()
    session.refresh(review)
    return review


# ---------------------------------------------------------------------------
# Create — Users
# ---------------------------------------------------------------------------


def create_user(
    session: Session,
    email: str,
    name: Optional[str] = None,
) -> Users:
    user = Users(email=email, name=name)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


# ---------------------------------------------------------------------------
# Create / Update — Conversations
# ---------------------------------------------------------------------------


def create_conversation(
    session: Session,
    query: str,
    user_id: uuid.UUID,
    status: ConversationStatus = "pending",
    openai_conv_id: Optional[str] = None,
) -> Conversations:
    conversation = Conversations(
        query=query, user_id=user_id, status=status, openai_conv_id=openai_conv_id
    )
    session.add(conversation)
    session.commit()
    session.refresh(conversation)
    return conversation


def update_conversation(
    session: Session,
    conversation_id: uuid.UUID,
    status: ConversationStatus,
) -> Optional[Conversations]:
    conversation = session.get(Conversations, conversation_id)
    if not conversation:
        return None
    conversation.status = status
    session.add(conversation)
    session.commit()
    session.refresh(conversation)
    return conversation


# ---------------------------------------------------------------------------
# Create — Messages
# ---------------------------------------------------------------------------


def create_message(
    session: Session,
    conversation_id: uuid.UUID,
    content: str,
    user_id: Optional[uuid.UUID] = None,
    role: Literal["user", "assistant"] = "user",
    updated_at: Optional[datetime.datetime] = datetime.datetime.now(),
) -> Messages:
    message = Messages(
        conversation_id=conversation_id, user_id=user_id, content=content, role=role,
        updated_at=updated_at
    )
    session.add(message)
    session.commit()
    session.refresh(message)
    return message


# ---------------------------------------------------------------------------
# Create — PDF Documents
# ---------------------------------------------------------------------------


def create_pdf_document(
    session: Session,
    conversation_id: uuid.UUID,
    file_name: Optional[str] = None,
    file_path: Optional[str] = None,
    updated_at: Optional[datetime.datetime] = datetime.datetime.now(),
) -> PdfDocuments:
    doc = PdfDocuments(
        conversation_id=conversation_id, file_name=file_name, file_path=file_path,
        updated_at=updated_at
    )
    session.add(doc)
    session.commit()
    session.refresh(doc)
    return doc


def get_pdf_documents(session, conversation_id):
    statement = select(PdfDocuments).where(
        PdfDocuments.conversation_id == conversation_id
    )   
    return session.exec(statement).first()
