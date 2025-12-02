from pydantic import BaseModel, Field
from typing import Optional


# ---------------------------------------
# MessageIn: 프론트 → 서버
# ---------------------------------------
class MessageIn(BaseModel):
    role: str
    content: str
    conversation_id: Optional[str] = Field(default=None, alias="conversationId")

    class Config:
        populate_by_name = True  # 서버에서도 conversation_id 로 접근 가능하게


# ---------------------------------------
# MessageOut: 서버 → 프론트
# ---------------------------------------
class MessageOut(BaseModel):
    id: str
    conversation_id: str = Field(alias="conversationId")
    role: str
    content: str
    created_at: str = Field(alias="createdAt")

    class Config:
        by_alias = True  # 서버 REST 응답 시 camelCase로 자동 변환


# ---------------------------------------
# Conversation: 서버 → 프론트
# ---------------------------------------
class Conversation(BaseModel):
    id: str
    title: str
    created_at: str = Field(alias="createdAt")
    updated_at: str = Field(alias="updatedAt")

    class Config:
        by_alias = True


# ---------------------------------------
# CreateMessageResponse: 서버 → 프론트
# ---------------------------------------
class CreateMessageResponse(BaseModel):
    conversation: Conversation
    message: MessageOut

    class Config:
        by_alias = True


# ---------------------------------------
# PdfResponse: 서버 → 프론트
# ---------------------------------------
class PdfResponse(BaseModel):
    pdf_id: str = Field(alias="pdfId")
    chunks: int
    message: str

    class Config:
        by_alias = True
