import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.conversations import router as conversations_router
from .api.messages import router as messages_router
from .api.chat import router as chat_router


def _parse_allowed_origins() -> list[str]:
    env_value = os.getenv("ALLOWED_ORIGINS", "")
    origins = [origin.strip() for origin in env_value.split(",") if origin.strip()]

    if origins:
        return origins

    return [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]


app = FastAPI()

allowed_origins = _parse_allowed_origins()
allow_credentials = "*" not in allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(conversations_router, prefix="/api")
app.include_router(messages_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
