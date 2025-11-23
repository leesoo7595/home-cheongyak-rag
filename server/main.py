from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
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
DATA_PATH = BASE_PATH / "data.jsonl"

class Message(BaseModel):
    role: str
    content: str

class ChatCompletionsBody(BaseModel):
    messages: list[Message]

def iter_jsonl():
  """JSONL 파일을 한 줄씩 읽어 파이썬 객체로 yield"""
  if not DATA_PATH.exists():
    return

  with DATA_PATH.open("r", encoding="utf-8") as f:
    for line in f:
      line = line.strip()
      if not line:
        continue
      yield json.loads(line)

@app.get("/")
def get_health():
  return "hello"

@app.get("/_localdb/chat_completions")
def get_chat_completions():
    """모든 항목 가져오기"""
    return list(iter_jsonl())

@app.post("/_localdb", response_model=Message)
def create_term(msg: Message):
    new_msg = {
      "role": msg.role,
      "content": msg.content,
    }
    with DATA_PATH.open("a", encoding="utf-8") as f:
      f.write(json.dumps(new_msg, ensure_ascii=False) + "\n")
    
    return new_msg


