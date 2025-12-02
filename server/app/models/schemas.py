from pydantic import BaseModel, Field
from typing import Optional

# ---------------------------------------
# MessageIn: 프론트 → 서버 (요청)
# ---------------------------------------
class MessageIn(BaseModel):
    role: str
    content: str
    conversation_id: Optional[str] = Field(default=None, alias="conversationId")

    class Config:
        # 프론트에서 camelCase(conversationId)로 보내도 되고,
        # 서버 내부에서 conversation_id로도 세팅 가능하게
        populate_by_name = True


# ---------------------------------------
# MessageOut: 서버 → 프론트 (응답)
# ---------------------------------------
class MessageOut(BaseModel):
    id: str
    conversation_id: str = Field(serialization_alias="conversationId")
    role: str
    content: str
    created_at: str = Field(serialization_alias="createdAt")

    class Config:
        # 응답 직렬화할 때 alias(= serialization_alias)를 쓰도록
        by_alias = True


# ---------------------------------------
# Conversation: 서버 → 프론트
# ---------------------------------------
class Conversation(BaseModel):
    id: str
    title: str
    created_at: str = Field(serialization_alias="createdAt")
    updated_at: str = Field(serialization_alias="updatedAt")

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
class PdfUploadResponse(BaseModel):
    conversation_id: str = Field(serialization_alias="conversationId")

    class Config:
        by_alias = True