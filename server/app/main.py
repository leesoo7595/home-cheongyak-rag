from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.conversations import router as conversations_router
from .api.messages import router as messages_router
from .api.chat import router as chat_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(conversations_router, prefix="/api")
app.include_router(messages_router, prefix="/api")
app.include_router(chat_router, prefix="/api")   
