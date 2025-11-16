# PolyDoc AI — Multilingual Document Understanding (PPT)

---

## Introduction

### What is the project about?
- A free, self‑hosted platform that converts heterogeneous documents (PDF/DOCX/PPTX/Images/HTML/MD/TXT/JSON) into searchable knowledge with chat‑style Q&A and summarization.
- Focus on Indic scripts with robust OCR and hybrid language detection.

### Why choose this project?
- Privacy: run locally without paid APIs.
- Practical: CPU‑friendly defaults; small multilingual models.
- Accurate: script‑aware OCR, hybrid language detection, and RAG improve results.

### Who will use this project?
- Students/researchers digitizing multilingual material.
- Enterprises/governments with scanned archives.
- SMEs and teams needing cost‑effective document search and Q&A.

---

## Problem Statement
- Documents are diverse (scanned + born‑digital) and multilingual (Indic scripts + English).
- Off‑the‑shelf solutions struggle on short spans and noisy scans; API costs and privacy constraints block adoption.
- Need end‑to‑end: parse → OCR → language detect → chunk → embed → retrieve → summarize/answer with predictable latency.

---

## Objectives
- Build a self‑hosted pipeline for multilingual document understanding with specialized Indic support.
- Achieve robust OCR via EasyOCR primary + Tesseract fallback.
- Improve language identification using a hybrid approach (langdetect + Unicode script ranges).
- Provide semantic retrieval (FAISS) and RAG‑style QA/summarization on CPU.
- Offer a modern UI and simple APIs for integration.

---

## Project Features
- Multi‑format ingestion: PDF, DOCX, PPTX, PNG/JPG/TIFF, HTML/MD, CSV/XLSX, JSON/XML/ODT.
- Hybrid OCR: multi‑version preprocessing → EasyOCR; fallback to Tesseract when needed.
- Hybrid Indic language detection (short‑span friendly).
- Chunking (500/50) + multilingual embeddings (MiniLM‑L12‑v2, 384‑d).
- Vector search with FAISS; optional MongoDB persistence.
- Q&A (RoBERTa‑SQuAD2) and summarization (BART/DistilBART + extractive fallback).
- Latency estimator; analytics; WebSocket streaming chat; authentication optional.

---

## Technologies Used
- Backend: FastAPI (Python), asyncio.
- OCR/CV: EasyOCR, Tesseract, OpenCV, Pillow.
- NLP/ML: Hugging Face Transformers, Sentence‑Transformers (paraphrase‑multilingual‑MiniLM‑L12‑v2).
- Search/Store: FAISS (IndexFlatIP, cosine), MongoDB (optional).
- Parsing: PyPDF2, python‑docx, python‑pptx, BeautifulSoup, markdown, pandas/openpyxl.
- Frontend: React, Tailwind, WebSocket.

---

## Expected Outcome
- Reliable OCR on mixed English/Indic scans with improved recall on low‑contrast text via preprocessing and hybrid engines.
- Higher Indic language detection accuracy on short spans vs langdetect‑only.
- Strong retrieval quality (Recall@k/MRR) and answerability on CPU with seconds‑level latency.
- Private, reproducible deployment with scripts to regenerate metrics and figures.

---

## Language Support
- 12 languages: English + 11 Indian languages
- Hindi (hi), Kannada (kn), Marathi (mr), Telugu (te), Tamil (ta), Bengali (bn), Gujarati (gu), Punjabi (pa), Malayalam (ml), Odia (or), Assamese (as), English (en).

---

## Conclusion
- PolyDoc unifies script‑aware OCR, hybrid language detection, multilingual embeddings, and transformer heads into a reproducible, self‑hosted system.
- Delivers practical accuracy and latency on commodity hardware while preserving privacy and cost control.
- Extensible roadmap: layout‑aware models, TrOCR/Donut fine‑tuning, FAISS IVF/HNSW, expanded Indic evaluation.
