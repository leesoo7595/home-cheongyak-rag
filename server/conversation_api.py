from fastapi import APIRouter

from models import Conversation, MessageOut
from storage import (
    load_conversations,
    get_messages_path,
    iter_jsonl,
    CONVERSATIONS_PATH
)

router = APIRouter()

@router.get("/conversations", response_model=list[Conversation] )
def get_conversations():
  """
  사이드바에서 사용할 대화 목록 가져오기
  최근 업데이트 순으로 정렬해서 리턴해도 됨
  """
  convos = list(load_conversations().values())
  print("Before sorting:", convos)
  convos.sort(key=lambda c: c["updated_at"], reverse=True)
  print("Conversations:", convos)
  return convos

@router.get("/conversations/{conversation_id}/messages", response_model=list[MessageOut])
def get_conversation_messages(conversation_id: str):
    path = get_messages_path(conversation_id)
    msgs: list[MessageOut] = []

    if not path.exists():
        return []  # 아직 메시지 없는 대화일 수도 있음

    for row in iter_jsonl(path):
        msgs.append(MessageOut(**row))

    return msgs

# ---------- (기존 전체 dump용) 디버깅용 엔드포인트 ----------

@router.get("/raw/conversations")
def get_all_conversations_raw():
  """디버깅용: 모든 대화 jsonl 덤프"""
  return list(iter_jsonl(CONVERSATIONS_PATH))
