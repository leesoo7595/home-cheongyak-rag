from typing import Any

from fastapi import APIRouter

from ..models.schemas import Conversation, MessageOut
from ..services.storage import (
    load_conversations,
    get_messages_path,
    iter_jsonl,
    CONVERSATIONS_PATH,
)

router = APIRouter(
    prefix="/conversations",
    tags=["conversations"],
)


@router.get("", response_model=list[Conversation])
def get_conversations():
    """
    사이드바에서 사용할 대화 목록 가져오기.
    updated_at 기준 내림차순 정렬.
    """
    convos = list(load_conversations().values())
    convos.sort(key=lambda c: c["updated_at"], reverse=True)
    return convos


@router.get("/{conversation_id}/messages", response_model=list[MessageOut])
def get_conversation_messages(conversation_id: str):
    """
    특정 대화의 메시지 목록 가져오기.
    메시지 파일이 없으면 빈 리스트 반환.
    """
    path = get_messages_path(conversation_id)
    msgs: list[MessageOut] = []

    if not path.exists():
        return []

    for row in iter_jsonl(path):
        msgs.append(MessageOut(**row))

    return msgs


# ---------- 디버깅용 엔드포인트 ----------

@router.get("/raw", response_model=list[dict[str, Any]])
def get_all_conversations_raw():
    """
    디버깅용: conversations.jsonl 전체 덤프.
    실제 프론트에서는 사용 안 하는 걸 추천.
    """
    return list(iter_jsonl(CONVERSATIONS_PATH))
