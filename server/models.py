from pydantic import BaseModel, Field
from typing import Optional

class MessageIn(BaseModel):
  role: str
  content: str
  # 프론트에서 기존 대화에 이어서 보낼 때 사용 (새 대화면 None)
  conversation_id: Optional[str] = Field(default=None, alias="conversationId")


class MessageOut(BaseModel):
  id: str
  conversationId: str = Field(alias="conversation_id")
  role: str
  content: str
  createdAt: str = Field(alias="created_at")


class Conversation(BaseModel):
  id: str
  title: str
  createdAt: str = Field(alias="created_at")
  updatedAt: str = Field(alias="updated_at")


class CreateMessageResponse(BaseModel):
  conversation: Conversation
  message: MessageOut

class PdfResponse(BaseModel):
  pdf_id: str = Field(alias="pdfId")
  chunks: int
  message: str