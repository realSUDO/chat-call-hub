#!/usr/bin/env python3
import json
import sys

# Read input first
input_data = json.loads(sys.stdin.read())
message = input_data['message']

# Handle greetings immediately (before loading heavy models)
greetings = ['hi', 'hello', 'hey', 'namaste']
if message.lower().strip() in greetings:
    print(json.dumps({'response': "Hello! I'm LaWEase, your legal assistant for Indian Constitution. How can I help you with legal or constitutional matters today?"}))
    sys.exit(0)

# Now load heavy dependencies
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
import os
import torch
import re

# Force CPU
torch.set_num_threads(1)

# Paths
VECTOR_DB_PATH = os.path.expanduser('~/db/faiss.index')
CHUNKS_PATH = os.path.expanduser('~/db/chunks.json')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

# Load model and index
model = SentenceTransformer('nlpaueb/legal-bert-small-uncased', device='cpu')
index = faiss.read_index(VECTOR_DB_PATH)

with open(CHUNKS_PATH, 'r') as f:
    chunks = json.load(f)

genai.configure(api_key=GEMINI_API_KEY)
gemini = genai.GenerativeModel('gemini-2.5-flash-lite')

# Guardrails - Block prompt injections and harmful content
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
    """Check for prompt injections and harmful content"""
    query_lower = query.lower()
    
    # Block prompt injection attempts
    for pattern in PROMPT_INJECTION_PATTERNS:
        if re.search(pattern, query_lower):
            return False, "I'm LaWEase, a legal assistant. I can only help with legal and constitutional matters."
    
    # Block harmful content
    for pattern in HARMFUL_PATTERNS:
        if re.search(pattern, query_lower):
            return False, "I cannot assist with harmful or dangerous queries."
    
    # Allow everything else - LLM will handle topic relevance
    return True, None

def check_response_safety(response):
    """Check if response is safe and on-topic"""
    response_lower = response.lower()
    
    # Check for harmful content in response
    for pattern in HARMFUL_PATTERNS:
        if re.search(pattern, response_lower):
            return False
    
    return True

def search_vector_db(query, k=3):
    query_vector = model.encode([query])[0].astype('float32')
    distances, indices = index.search(np.array([query_vector]), k)
    return [chunks[idx]['text'] for idx in indices[0]]

def get_rag_response(user_message):
    # Guardrail 1: Check query relevance
    is_relevant, error_msg = check_query_relevance(user_message)
    if not is_relevant:
        return error_msg
    
    # Search vector DB
    relevant_chunks = search_vector_db(user_message, k=3)
    context = "\n\n".join(relevant_chunks)
    
    # Create prompt with guardrails
    prompt = f"""You are LaWEase, a legal assistant specialized in Indian Constitution and law.

STRICT RULES:
- Only answer questions in context with Indian law, constitution, and legal matters 
- Try to find legal aspects of asked query and respond accordingly
- If asked about non-legal topics, politely redirect to legal queries
- Do not provide advice on illegal activities
- Stay frank and factual , adapt to user's humor, while maintaining professional decorum
- Keep responses short-medium

Context from Indian Constitution:
{context}

User Question: {user_message}

Provide a clear, accurate answer based on the context above."""
    
    # Get Gemini response
    response = gemini.generate_content(prompt)
    response_text = response.text
    
    # Guardrail 2: Check response safety
    if not check_response_safety(response_text):
        return "I can only provide information about Indian Constitution and legal matters. Please ask a legal question."
    
    return response_text

# Process non-greeting messages
response = get_rag_response(message)
print(json.dumps({'response': response}))
