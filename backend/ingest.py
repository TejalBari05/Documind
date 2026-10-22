import fitz  # PyMuPDF

def load_pdf(path):
    text = ""

    with fitz.open(path) as doc:
        for page in doc:
            page_text = page.get_text()
            if page_text:
                text += page_text

    return text

def chunk_text(text, chunk_size=400, overlap=150):
    chunks = []
    start = 0
    while start < len(text):
        chunks.append(text[start:start + chunk_size])
        start += chunk_size - overlap
    return chunks
