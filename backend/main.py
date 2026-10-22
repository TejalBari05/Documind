from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import faiss
import numpy as np

from ingest import load_pdf, chunk_text
from vector_store import model
from rag import generate_answer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

index = None
chunks_store = []

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    global index, chunks_store

    path = f"data/{file.filename}"
    with open(path, "wb") as f:
        f.write(await file.read())

    text = load_pdf(path)

    
    if not text or not text.strip():
        return {"message": "No readable text found in PDF. It may be scanned or image-based."}

    chunks = chunk_text(text)
    embeddings = model.encode(chunks)

    if index is None:
        index = faiss.IndexFlatL2(embeddings.shape[1])

    index.add(np.array(embeddings))
    chunks_store.extend(chunks)

    return {"message": "PDF uploaded successfully"}


@app.post("/chat")
def chat(query: str):
    if index is None:
        return {"answer": "Upload a PDF first"}

    answer = generate_answer(query, index, chunks_store)
    return {"answer": answer}

