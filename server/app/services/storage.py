from pathlib import Path
from typing import Dict, Any
from uuid import uuid4
from datetime import datetime
import json

# server/app/services/storage.py → server/app/services → server → project_root
BASE_DIR = Path(__file__).resolve().parents[2]   # server/
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

CONVERSATIONS_PATH = DATA_DIR / "conversations.jsonl"
CONVERSATIONS_DIR = DATA_DIR / "conversations"
CONVERSATIONS_DIR.mkdir(parents=True, exist_ok=True) # 디렉터리 없으면 생성


def get_messages_path(conversation_id: str) -> Path:
    return CONVERSATIONS_DIR / f"{conversation_id}.jsonl"


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
