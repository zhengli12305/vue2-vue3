from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .parser import parse_uploaded_file
from .schemas import ParseQuestionsResponse

app = FastAPI(title="Quiz Parser API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}


@app.post("/api/parse-questions", response_model=ParseQuestionsResponse)
async def parse_questions(file: UploadFile = File(...)) -> ParseQuestionsResponse:
    if not file.filename:
        raise HTTPException(status_code=400, detail="文件名为空。")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="文件内容为空。")

    try:
        return parse_uploaded_file(file.filename, content)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail="解析服务内部错误。") from exc
