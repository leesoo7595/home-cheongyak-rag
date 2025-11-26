from fastapi import APIRouter, HTTPException
from datetime import datetime
from uuid import uuid4

from models import CreateMessageResponse, Conversation, MessageIn, MessageOut
from storage import (
    load_conversations,
    create_conversation,
    get_messages_path,
    update_conversation_updated_at,
    append_jsonl,
    iter_jsonl,
    CONVERSATIONS_DIR,
)

router = APIRouter()

@router.post("/messages", response_model=CreateMessageResponse)
def create_message(msg: MessageIn):
    # 1) 어떤 대화인지 결정
    if msg.conversation_id:
        # 기존 대화
        convos = load_conversations()
        conversation = convos.get(msg.conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

    conversation_id = conversation["id"]

    # 2) 메시지 생성 + 해당 대화 파일에 append
    now = datetime.utcnow().isoformat()
    new_msg = {
        "id": str(uuid4()),
        "conversation_id": conversation_id,
        "role": msg.role,
        "content": msg.content,
        "created_at": now,
    }

    messages_path = get_messages_path(conversation_id)
    append_jsonl(messages_path, new_msg)

    # 3) updated_at 갱신
    updated_conversation = update_conversation_updated_at(conversation_id)

    return CreateMessageResponse(
        conversation=Conversation(**updated_conversation),
        message=MessageOut(**new_msg),
    )

# ---------- (기존 전체 dump용) 디버깅용 엔드포인트 ----------

@router.get("/raw/messages")
def get_all_messages_raw():
  """디버깅용: 모든 메시지 jsonl 덤프"""
  return list(iter_jsonl(CONVERSATIONS_DIR / "all_messages.jsonl"))

