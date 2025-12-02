from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.conversations import router as conversations_router
from .api.messages import router as messages_router
from .api.pdfs import router as pdfs_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(conversations_router)
app.include_router(messages_router)
app.include_router(pdfs_router)
