import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def create_index(embeddings):
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(np.array(embeddings))
    return index

def search_index(index, chunks, query, k=8):
    q_emb = model.encode([query])
    total = index.ntotal
    k = min(k, total)  # don't request more chunks than exist
    _, indices = index.search(np.array(q_emb), k)
    return [chunks[i] for i in indices[0] if i < total]
