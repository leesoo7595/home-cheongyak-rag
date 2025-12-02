from fastapi import APIRouter, UploadFile, File, HTTPException
from starlette.responses import FileResponse
import fitz
from pathlib import Path

from ..services.storage import create_conversation
from ..services.rag import (
    INDEX_NAME,
    client,
    chunk_text,
    embed_in_batches,
    index_chunks_for_pdf,
)
from ..models.schemas import PdfUploadResponse


router = APIRouter(
    prefix="/pdfs",
    tags=["pdfs"],
)

# 서버 저장 경로 설정 (server/data/pdfs)
BASE_DIR = Path(__file__).resolve().parents[2]  # project/server/
UPLOAD_DIR = BASE_DIR / "data" / "pdfs"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------
# PDF 업로드 → 텍스트 추출 → 청킹 → 임베딩 → OpenSearch 인덱싱
# ---------------------------------------------------------
@router.post("", response_model=PdfUploadResponse)
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


# ---------------------------------------------------------
# 저장된 PDF 파일 가져오기
# ---------------------------------------------------------
@router.get("/{conversation_id}")
async def get_pdf(conversation_id: str):
    print("[get_pdf] ID:", conversation_id)

    pdf_file = f"{conversation_id}.pdf" if not conversation_id.endswith(".pdf") else conversation_id
    pdf_path = UPLOAD_DIR / pdf_file

    print("[get_pdf] file_path:", pdf_path, "exists?", pdf_path.exists())

    if not pdf_path.exists():
        raise HTTPException(status_code=404, detail="PDF 파일을 찾을 수 없습니다.")

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=pdf_file,
    )
