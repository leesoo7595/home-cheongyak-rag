from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pathlib import Path
from typing import Dict, Any, Optional
from uuid import uuid4
from datetime import datetime
import json

app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5173"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

BASE_PATH = Path(__file__).parent
CONVERSATIONS_PATH = BASE_PATH / "conversations.jsonl"
CONVERSATIONS_DIR = BASE_PATH / "conversations"
CONVERSATIONS_DIR.mkdir(exist_ok=True)  # 디렉터리 없으면 생성

def get_messages_path(conversation_id: str) -> Path:
    return CONVERSATIONS_DIR / f"{conversation_id}.jsonl"

# ---------- Pydantic Models ----------

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


# ---------- JSONL Helpers ----------

def iter_jsonl(path: Path):
    if not path.exists():
        return
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            yield json.loads(line)

def append_jsonl(path: Path, obj: Dict[str, Any]) -> None:
  """JSONL 파일에 한 줄 append"""
  with path.open("a", encoding="utf-8") as f:
    f.write(json.dumps(obj, ensure_ascii=False) + "\n")


# ---------- Conversations Helpers ----------

def load_conversations() -> Dict[str, Dict[str, Any]]:
  """conversations.jsonl -> {id: conversation_dict} 형태로 로드"""
  convos: Dict[str, Dict[str, Any]] = {}
  for row in iter_jsonl(CONVERSATIONS_PATH):
    convos[row["id"]] = row
  return convos


def save_conversations(convos: Dict[str, Dict[str, Any]]) -> None:
  """모든 conversation을 conversations.jsonl에 다시 씀 (덮어쓰기)"""
  with CONVERSATIONS_PATH.open("w", encoding="utf-8") as f:
    for convo in convos.values():
      f.write(json.dumps(convo, ensure_ascii=False) + "\n")


def create_conversation(title: str) -> Dict[str, Any]:
  """새 대화 생성"""
  now = datetime.utcnow().isoformat()
  convo_id = str(uuid4())
  convo = {
    "id": convo_id,
    "title": title,
    "created_at": now,
    "updated_at": now,
  }
  append_jsonl(CONVERSATIONS_PATH, convo)
  return convo


def update_conversation_updated_at(conversation_id: str) -> Dict[str, Any]:
  """대화의 updated_at 갱신"""
  convos = load_conversations()
  convo = convos.get(conversation_id)
  if not convo:
    raise ValueError("Conversation not found")

  convo["updated_at"] = datetime.utcnow().isoformat()
  convos[conversation_id] = convo
  save_conversations(convos)
  return convo


# ---------- Health Check ----------

@app.get("/")
def get_health():
  return "hello"


# ---------- Conversations APIs ----------

@app.get("/_localdb/conversations", response_model=list[Conversation])
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

@app.get("/_localdb/conversations/{conversation_id}/messages", response_model=list[MessageOut])
def get_conversation_messages(conversation_id: str):
    path = get_messages_path(conversation_id)
    msgs: list[MessageOut] = []

    if not path.exists():
        return []  # 아직 메시지 없는 대화일 수도 있음

    for row in iter_jsonl(path):
        msgs.append(MessageOut(**row))

    return msgs

# ---------- Messages API (핵심: 기존 POST 대체) ----------

@app.post("/_localdb/messages", response_model=CreateMessageResponse)
def create_message(msg: MessageIn):
    # 1) 어떤 대화인지 결정
    if msg.conversation_id:
        # 기존 대화
        convos = load_conversations()
        conversation = convos.get(msg.conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        # 새 대화 시작
        title = msg.content.strip().split("\n")[0][:30]
        conversation = create_conversation(title)

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

@app.get("/_localdb/raw/messages")
def get_all_messages_raw():
  """디버깅용: 모든 메시지 jsonl 덤프"""
  return list(iter_jsonl(CONVERSATIONS_DIR / "all_messages.jsonl"))


@app.get("/_localdb/raw/conversations")
def get_all_conversations_raw():
  """디버깅용: 모든 대화 jsonl 덤프"""
  return list(iter_jsonl(CONVERSATIONS_PATH))
