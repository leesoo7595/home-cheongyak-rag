from typing import Any
from fastapi import APIRouter, UploadFile, File, HTTPException
from starlette.responses import FileResponse
import fitz
from pathlib import Path

from ..models.schemas import (
  PdfUploadResponse,
  Conversation, 
  MessageOut,
)

from ..services.rag import (
    INDEX_NAME,
    client,
    chunk_text,
    embed_in_batches,
    index_chunks_for_pdf,
)
from ..services.storage import (
    create_conversation,
    load_conversations,
    get_messages_path,
    iter_jsonl,
    CONVERSATIONS_PATH,
)

router = APIRouter()

# 서버 저장 경로 설정 (server/data/pdfs)
BASE_DIR = Path(__file__).resolve().parents[2]  # project/server/
UPLOAD_DIR = BASE_DIR / "data" / "pdfs"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------
# PDF 업로드 → 텍스트 추출 → 청킹 → 임베딩 → OpenSearch 인덱싱
# ---------------------------------------------------------
@router.post("/conversations", response_model=PdfUploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    # 1) PDF 파일인지 확인
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="PDF 파일만 가능합니다.")

    # 2) PDF 텍스트 추출
    try:
        pdf_bytes = await file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")

        full_text = ""
        for page in doc:
            full_text += page.get_text("text") + "\n"

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF 처리 실패: {str(e)}")

    if not full_text.strip():
        raise HTTPException(status_code=400, detail="PDF에서 텍스트를 추출할 수 없습니다.")

    # 3) 텍스트 청킹
    chunks = chunk_text(full_text)
    print(f"[PDF] chunk count: {len(chunks)}")

    # 4) bge-m3 임베딩
    dense_vecs = embed_in_batches(chunks, size=8)

    # 5) 대화(conversation) 생성
    title = file.filename
    conversation_id = create_conversation(title)["id"]

    # 6) PDF 파일 저장
    pdf_path = UPLOAD_DIR / f"{conversation_id}.pdf"

    # file 포인터 리셋 후 저장
    await file.seek(0)
    with pdf_path.open("wb") as f:
        f.write(await file.read())

    # 7) OpenSearch 인덱싱
    index_chunks_for_pdf(conversation_id, chunks, dense_vecs)

    return PdfUploadResponse(conversation_id=conversation_id)

@router.get("/conversations", response_model=list[Conversation])
def get_conversations():
    """
    사이드바에서 사용할 대화 목록 가져오기.
    updated_at 기준 내림차순 정렬.
    """
    convos = list(load_conversations().values())
    convos.sort(key=lambda c: c["updated_at"], reverse=True)
    return convos


@router.get("/conversations/{conversation_id}/messages", response_model=list[MessageOut])
def get_conversation_messages(conversation_id: str):
    """
    특정 대화의 메시지 목록 가져오기.
    메시지 파일이 없으면 빈 리스트 반환.
    """
    path = get_messages_path(conversation_id)
    msgs: list[MessageOut] = []

    if not path.exists():
        return []

    for row in iter_jsonl(path):
        msgs.append(MessageOut(**row))

    return msgs


def _resolve_pdf_path(conversation_id: str) -> Path:
    pdf_file = (
        f"{conversation_id}.pdf"
        if not conversation_id.endswith(".pdf")
        else conversation_id
    )
    return UPLOAD_DIR / pdf_file


# ---------------------------------------------------------
# 저장된 PDF 파일 가져오기
# ---------------------------------------------------------
@router.get("/conversations/{conversation_id}/pdf")
async def get_pdf(conversation_id: str):
    pdf_path = _resolve_pdf_path(conversation_id)

    if not pdf_path.exists():
        raise HTTPException(404, "PDF 파일을 찾을 수 없습니다.")

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=pdf_path.name,
    )

# 예전 스타일 경로 (/api/pdfs/{id}.pdf)도 같이 지원
@router.get("/pdfs/{pdf_id}")
async def get_pdf_legacy(pdf_id: str):
    """
    프론트에서 아직 /api/pdfs/{id}.pdf 로 요청하는 경우를 위한 호환용 라우트.
    pdf_id = "5a36...c34f.pdf" 또는 "5a36...c34f" 둘 다 처리.
    """
    pdf_path = _resolve_pdf_path(pdf_id)

    if not pdf_path.exists():
        raise HTTPException(404, "PDF 파일을 찾을 수 없습니다.")

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=pdf_path.name,
    )

# ---------- 디버깅용 엔드포인트 ----------

@router.get("/raw", response_model=list[dict[str, Any]])
def get_all_conversations_raw():
    """
    디버깅용: conversations.jsonl 전체 덤프.
    실제 프론트에서는 사용 안 하는 걸 추천.
    """
    return list(iter_jsonl(CONVERSATIONS_PATH))
