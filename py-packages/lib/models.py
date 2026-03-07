from typing import Optional
import datetime
import uuid

from sqlalchemy import Column, DateTime, Double, ForeignKeyConstraint, Index, PrimaryKeyConstraint, Text, UniqueConstraint, Uuid, text
from sqlmodel import Field, Relationship, SQLModel

class Products(SQLModel, table=True):
    __table_args__ = (
        PrimaryKeyConstraint('id', name='products_pkey'),
    )

    id: uuid.UUID = Field(sa_column=Column('id', Uuid, primary_key=True, server_default=text('gen_random_uuid()')))
    created_at: datetime.datetime = Field(sa_column=Column('created_at', DateTime, nullable=False, server_default=text('now()')))
    updated_at: datetime.datetime = Field(sa_column=Column('updated_at', DateTime, nullable=False))
    name: Optional[str] = Field(default=None, sa_column=Column('name', Text))
    url: Optional[str] = Field(default=None, sa_column=Column('url', Text))
    price: Optional[float] = Field(default=None, sa_column=Column('price', Double(53)))
    query: Optional[str] = Field(default=None, sa_column=Column('query', Text))
    company: Optional[str] = Field(default=None, sa_column=Column('company', Text))
    category: Optional[str] = Field(default=None, sa_column=Column('category', Text))

    product_reviews: list['ProductReviews'] = Relationship(back_populates='product')


class Users(SQLModel, table=True):
    __table_args__ = (
        PrimaryKeyConstraint('id', name='users_pkey'),
        UniqueConstraint('email', name='users_email_unique')
    )

    id: uuid.UUID = Field(sa_column=Column('id', Uuid, primary_key=True, server_default=text('gen_random_uuid()')))
    created_at: datetime.datetime = Field(sa_column=Column('created_at', DateTime, nullable=False, server_default=text('now()')))
    updated_at: datetime.datetime = Field(sa_column=Column('updated_at', DateTime, nullable=False))
    name: Optional[str] = Field(default=None, sa_column=Column('name', Text))
    email: Optional[str] = Field(default=None, sa_column=Column('email', Text))

    conversations: list['Conversations'] = Relationship(back_populates='user')
    messages: list['Messages'] = Relationship(back_populates='user')


class Conversations(SQLModel, table=True):
    __table_args__ = (
        ForeignKeyConstraint(['user_id'], ['users.id'], name='conversations_user_id_users_id_fk'),
        PrimaryKeyConstraint('id', name='conversations_pkey'),
        UniqueConstraint('openai_conv_id', name='conversations_openai_conv_id_unique'),
        Index('conversations_openai_conv_id_index', 'openai_conv_id'),
        Index('conversations_user_id_index', 'user_id')
    )

    id: uuid.UUID = Field(sa_column=Column('id', Uuid, primary_key=True, server_default=text('gen_random_uuid()')))
    created_at: datetime.datetime = Field(sa_column=Column('created_at', DateTime, nullable=False, server_default=text('now()')))
    status: str = Field(sa_column=Column('status', Text, nullable=False, server_default=text("'pending'::text")))
    updated_at: datetime.datetime = Field(sa_column=Column('updated_at', DateTime, nullable=False))
    openai_conv_id: Optional[str] = Field(default=None, sa_column=Column('openai_conv_id', Text))
    query: Optional[str] = Field(default=None, sa_column=Column('query', Text))
    user_id: Optional[uuid.UUID] = Field(default=None, sa_column=Column('user_id', Uuid))

    user: Optional['Users'] = Relationship(back_populates='conversations')
    messages: list['Messages'] = Relationship(back_populates='conversation')
    pdf_documents: list['PdfDocuments'] = Relationship(back_populates='conversation')


class ProductReviews(SQLModel, table=True):
    __tablename__ = 'product_reviews'
    __table_args__ = (
        ForeignKeyConstraint(['product_id'], ['products.id'], name='product_reviews_product_id_products_id_fk'),
        PrimaryKeyConstraint('id', name='product_reviews_pkey'),
        Index('product_reviews_product_id_index', 'product_id')
    )

    id: uuid.UUID = Field(sa_column=Column('id', Uuid, primary_key=True, server_default=text('gen_random_uuid()')))
    created_at: datetime.datetime = Field(sa_column=Column('created_at', DateTime, nullable=False, server_default=text('now()')))
    updated_at: datetime.datetime = Field(sa_column=Column('updated_at', DateTime, nullable=False))
    product_id: Optional[uuid.UUID] = Field(default=None, sa_column=Column('product_id', Uuid))
    review_text: Optional[str] = Field(default=None, sa_column=Column('review_text', Text))

    product: Optional['Products'] = Relationship(back_populates='product_reviews')


class Messages(SQLModel, table=True):
    __table_args__ = (
        ForeignKeyConstraint(['conversation_id'], ['conversations.id'], name='messages_conversation_id_conversations_id_fk'),
        ForeignKeyConstraint(['user_id'], ['users.id'], name='messages_user_id_users_id_fk'),
        PrimaryKeyConstraint('id', name='messages_pkey'),
        Index('messages_conversation_id_index', 'conversation_id'),
        Index('messages_user_id_index', 'user_id')
    )

    id: uuid.UUID = Field(sa_column=Column('id', Uuid, primary_key=True, server_default=text('gen_random_uuid()')))
    role: str = Field(sa_column=Column('role', Text, nullable=False, server_default=text("'user'::text")))
    created_at: datetime.datetime = Field(sa_column=Column('created_at', DateTime, nullable=False, server_default=text('now()')))
    updated_at: datetime.datetime = Field(sa_column=Column('updated_at', DateTime, nullable=False))
    conversation_id: Optional[uuid.UUID] = Field(default=None, sa_column=Column('conversation_id', Uuid))
    user_id: Optional[uuid.UUID] = Field(default=None, sa_column=Column('user_id', Uuid))
    content: Optional[str] = Field(default=None, sa_column=Column('content', Text))

    conversation: Optional['Conversations'] = Relationship(back_populates='messages')
    user: Optional['Users'] = Relationship(back_populates='messages')


class PdfDocuments(SQLModel, table=True):
    __tablename__ = 'pdf_documents'
    __table_args__ = (
        ForeignKeyConstraint(['conversation_id'], ['conversations.id'], name='pdf_documents_conversation_id_conversations_id_fk'),
        PrimaryKeyConstraint('id', name='pdf_documents_pkey'),
        Index('pdf_documents_conversation_id_index', 'conversation_id')
    )

    id: uuid.UUID = Field(sa_column=Column('id', Uuid, primary_key=True, server_default=text('gen_random_uuid()')))
    created_at: datetime.datetime = Field(sa_column=Column('created_at', DateTime, nullable=False, server_default=text('now()')))
    updated_at: datetime.datetime = Field(sa_column=Column('updated_at', DateTime, nullable=False))
    conversation_id: Optional[uuid.UUID] = Field(default=None, sa_column=Column('conversation_id', Uuid))
    file_name: Optional[str] = Field(default=None, sa_column=Column('file_name', Text))
    file_path: Optional[str] = Field(default=None, sa_column=Column('file_path', Text))

    conversation: Optional['Conversations'] = Relationship(back_populates='pdf_documents')
