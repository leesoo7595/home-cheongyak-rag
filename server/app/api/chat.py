import os
import httpx
import json
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse

router = APIRouter()

CLOVA_BASE_URL = "https://clovastudio.stream.ntruss.com"
CLOVA_CHAT_PATH = "/v3/chat-completions/HCX-007"
CLOVA_API_TOKEN = os.getenv("CLOVA_API_TOKEN")


@router.post("/v3/chat-completions/HCX-007")
async def proxy_chat_completions(request: Request):
    if not CLOVA_API_TOKEN:
        raise HTTPException(status_code=500, detail="CLOVA_API_TOKEN is not set")

    # 프론트에서 넘어온 body 그대로 사용 (이미 JSON string)
    body = await request.body()
  
    # 1) bytes → dict
    try:
        body_json = json.loads(body.decode("utf-8"))
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    body_json["maxCompletionTokens"] = 30000

    # 3) dict → bytes
    patched_body = json.dumps(body_json).encode("utf-8")

    async def iter_stream():
        # 제너레이터가 돌고 있는 동안에만 클라이언트/스트림이 살아있게.
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream(
                "POST",
                CLOVA_BASE_URL + CLOVA_CHAT_PATH,
                content=patched_body,
                headers={
                    "Authorization": f"Bearer {CLOVA_API_TOKEN}",
                    "Content-Type": "application/json",
                    "Accept": "text/event-stream",  # Clova에게도 SSE로 달라고 명시
                },
            ) as upstream_response:
                # 혹시 바로 에러 한 번에 떨어지는 경우를 로그로 확인
                async for chunk in upstream_response.aiter_bytes():
                    text_preview = chunk[:200].decode(
                        "utf-8", errors="ignore"
                    )
                    print("[clova proxy] chunk:", repr(text_preview))
                    # 그대로 프론트로 흘려보냄
                    yield chunk

    # 브라우저 쪽은 SSE니까 media_type 고정
    return StreamingResponse(
        iter_stream(),
        media_type="text/event-stream",
    )
