import os
from dotenv import load_dotenv
from groq import Groq
from vector_store import search_index

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
MODEL_NAME = "llama-3.3-70b-versatile"

client = Groq(api_key=GROQ_API_KEY)

SYSTEM_PROMPT = """You are an expert document analyst. Answer questions directly and naturally based on the document provided.

Rules:
1. Give clean, direct answers — like a knowledgeable human assistant would.
2. NEVER mention "chunk", "context", "the document says", "based on the context", or any internal system terms.
3. NEVER reference chunk numbers or say things like "found in Chunk 3" — just state the information naturally.
4. Synthesize ALL relevant information from across the document before answering.
5. For factual questions (name, email, phone, etc.) — extract and state the answer directly.
6. For analytical questions (best project, top skills, etc.) — reason deeply, compare options, and give a well-explained answer.
7. Only say you don't know if the information is truly absent after thorough analysis.
8. Do NOT fabricate any information. Stick strictly to what is in the document."""

def generate_answer(question, index, chunks):
    context_chunks = search_index(index, chunks, question)
    context_text = "\n\n".join(context_chunks)

    prompt = f"""Use the document information below to answer the question. Synthesize all relevant details and answer naturally and directly.

{context_text}

Question: {question}

Answer directly and naturally. Do NOT mention chunks, context, or any internal terms. Just give the answer.
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=1500,
    )

    return response.choices[0].message.content.strip()
