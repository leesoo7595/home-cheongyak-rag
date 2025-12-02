import os
import httpx
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse

router = APIRouter()  # 여기서는 prefix 안 씀

CLOVA_BASE_URL = "https://clovastudio.stream.ntruss.com"
CLOVA_CHAT_PATH = "/v3/chat-completions/HCX-007"
CLOVA_API_TOKEN = os.getenv("CLOVA_API_TOKEN")


@router.post("/v3/chat-completions/HCX-007")
async def proxy_chat_completions(request: Request):
    if not CLOVA_API_TOKEN:
        raise HTTPException(status_code=500, detail="CLOVA_API_TOKEN is not set")

    body = await request.body()

    async with httpx.AsyncClient(timeout=None) as client:
        upstream_response = await client.stream(
            "POST",
            CLOVA_BASE_URL + CLOVA_CHAT_PATH,
            content=body,
            headers={
                "Authorization": f"Bearer {CLOVA_API_TOKEN}",
                "Content-Type": "application/json",
            },
        )

        async def iter_stream():
            async for chunk in upstream_response.aiter_bytes():
                yield chunk

        return StreamingResponse(
            iter_stream(),
            status_code=upstream_response.status_code,
            media_type=upstream_response.headers.get(
                "Content-Type", "text/event-stream"
            ),
        )
