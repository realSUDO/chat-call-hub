#!/usr/bin/env python3
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
import os
import torch
import re
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Force CPU
torch.set_num_threads(2)

# Paths
VECTOR_DB_PATH = os.path.expanduser('~/db/faiss.index')
CHUNKS_PATH = os.path.expanduser('~/db/chunks.json')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

# Load model and index ONCE at startup
print("Loading models...")
model = SentenceTransformer('nlpaueb/legal-bert-small-uncased', device='cpu')
index = faiss.read_index(VECTOR_DB_PATH)

with open(CHUNKS_PATH, 'r') as f:
    chunks = json.load(f)

genai.configure(api_key=GEMINI_API_KEY)
gemini = genai.GenerativeModel('gemini-2.5-flash-lite')
print("Models loaded!")

# Guardrails
PROMPT_INJECTION_PATTERNS = [
    r'ignore (previous|all|above|prior) (instructions|prompts|rules)',
    r'forget (everything|all|previous|prior)',
    r'you are (now|a) (new|different)',
    r'system prompt',
    r'act as',
    r'pretend (you are|to be)',
    r'disregard (previous|all|above)',
]

HARMFUL_PATTERNS = [
    r'\b(bomb|terrorist|kill|murder|suicide|weapon)\b',
]

def check_query_relevance(query):
    query_lower = query.lower()
    
    for pattern in PROMPT_INJECTION_PATTERNS:
        if re.search(pattern, query_lower):
            return False, "I'm LaWEase, a legal assistant. I can only help with legal and constitutional matters."
    
    for pattern in HARMFUL_PATTERNS:
        if re.search(pattern, query_lower):
            return False, "I cannot assist with harmful or dangerous queries."
    
    return True, None

def check_response_safety(response):
    response_lower = response.lower()
    
    for pattern in HARMFUL_PATTERNS:
        if re.search(pattern, response_lower):
            return False
    
    return True

def search_vector_db(query, k=3):
    query_vector = model.encode([query])[0].astype('float32')
    distances, indices = index.search(np.array([query_vector]), k)
    return [chunks[idx]['text'] for idx in indices[0]]

@app.route('/query', methods=['POST'])
def query():
    data = request.json
    message = data.get('message', '')
    
    # Handle greetings
    greetings = ['hi', 'hello', 'hey', 'namaste']
    if message.lower().strip() in greetings:
        return jsonify({'response': "Hello! I'm LaWEase, your legal assistant for Indian Constitution. How can I help you with legal or constitutional matters today?"})
    
    # Check query relevance
    is_relevant, error_msg = check_query_relevance(message)
    if not is_relevant:
        return jsonify({'response': error_msg})
    
    # Search vector DB
    relevant_chunks = search_vector_db(message, k=3)
    context = "\n\n".join(relevant_chunks)
    
    # Create prompt
    prompt = f"""You are LaWEase, a legal assistant specialized in Indian law.

STRICT RULES:
- Answer questions about Indian law, constitution, and legal matters
- If the context below contains relevant information, use it
- If the context doesn't help, use your general knowledge of Indian law (IPC, BNS, CrPC, etc.)
- If asked about non-legal topics, politely redirect to legal queries
- Do not provide advice on illegal activities
- Stay frank and factual, adapt to user's humor, while maintaining professional decorum
- Keep responses short-medium

Context from Indian Constitution:
{context}

User Question: {message}

Provide a clear, accurate answer. If the context above doesn't contain relevant information, use your knowledge of Indian law to answer."""
    
    # Get Gemini response
    response = gemini.generate_content(prompt)
    response_text = response.text
    
    # Check response safety
    if not check_response_safety(response_text):
        return jsonify({'response': "I can only provide information about Indian Constitution and legal matters. Please ask a legal question."})
    
    return jsonify({'response': response_text})

if __name__ == '__main__':
    app.run(port=5001, debug=False)
