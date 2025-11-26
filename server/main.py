from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from conversation_api import router as conversations_router
from messages_api import router as messages_router
from post_process_api import router as post_process_router

app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5173"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# ---------- Health Check ----------

@app.get("/")
def get_health():
  return "hello"

# ----------- Routers -----------

app.include_router(conversations_router, prefix="/_localdb")
app.include_router(messages_router, prefix="/_localdb")
app.include_router(post_process_router, prefix="/_localdb")