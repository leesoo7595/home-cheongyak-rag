from datetime import datetime
from uuid import uuid4
from typing import Any

from fastapi import APIRouter, HTTPException

from ..models.schemas import (
    CreateMessageResponse,
    Conversation,
    MessageIn,
    MessageOut,
)
from ..services.storage import (
    load_conversations,
    get_messages_path,
    update_conversation_updated_at,
    append_jsonl,
    iter_jsonl,
    CONVERSATIONS_DIR,
)

router = APIRouter(
    prefix="/messages",
    tags=["messages"],
)

@router.post("", response_model=CreateMessageResponse)
def create_message(msg: MessageIn):
    """
    일반 채팅 메시지 생성 엔드포인트.
    - 기존 대화(conversation_id 필수)에 메시지 추가
    - 대화 updated_at 갱신
    """
    if not msg.conversation_id:
        # 지금 구조에선 새 대화를 여기서 만들지 않고,
        # 미리 만들어진 대화에만 메시지를 추가한다고 가정.
        raise HTTPException(status_code=400, detail="conversation_id is required")

    # 1) 어떤 대화인지 결정
    convos = load_conversations()
    conversation = convos.get(msg.conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    conversation_id = conversation["id"]

    # 2) 메시지 JSONL에 저장
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


# ---------- 디버깅용 엔드포인트 ----------

@router.get("/raw", response_model=list[dict[str, Any]])
def get_all_messages_raw():
    """
    디버깅용: 모든 메시지 jsonl 덤프
    (실 서비스에선 비활성화 추천)
    """
    return list(iter_jsonl(CONVERSATIONS_DIR / "all_messages.jsonl"))
