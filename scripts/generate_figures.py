#!/usr/bin/env python3
"""
Generate figures for PolyDoc paper from test-backend results.
Outputs PNGs under md_files/figures/.
"""
import json
import math
from pathlib import Path
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
RESULTS = ROOT / "test-backend" / "results" / "complete_results.json"
OUTDIR = ROOT / "md_files" / "figures"
OUTDIR.mkdir(parents=True, exist_ok=True)

if not RESULTS.exists():
    raise SystemExit(f"Results file not found: {RESULTS}")

with open(RESULTS, "r", encoding="utf-8") as f:
    data = json.load(f)

tests = data.get("test_results", {})
sumres = tests.get("multilingual_summary_generation", {})
qares = tests.get("multilingual_qa", {})
langres = tests.get("indian_language_detection", {})

# Fig. 1: Average processing time per task
plt.figure(figsize=(6,4))
labels = ["Summary", "QA"]
values = [sumres.get("average_processing_time", 0.0), qares.get("average_processing_time", 0.0)]
colors = ["#4e79a7", "#f28e2b"]
plt.bar(labels, values, color=colors)
plt.ylabel("Seconds per sample (avg)")
plt.title("Average Processing Time per Task")
plt.grid(axis="y", linestyle=":", alpha=0.5)
plt.tight_layout()
plt.savefig(OUTDIR / "avg_processing_time.png", dpi=200)
plt.close()

# Fig. 2: QA metrics (similarity and confidence)
plt.figure(figsize=(6,4))
labels = ["Similarity", "Confidence"]
values = [qares.get("average_similarity", 0.0), qares.get("average_confidence", 0.0)]
colors = ["#59a14f", "#e15759"]
plt.bar(labels, values, color=colors)
plt.ylim(0, 1)
plt.ylabel("Score (0-1)")
plt.title("QA Metrics (Average)")
plt.grid(axis="y", linestyle=":", alpha=0.5)
plt.tight_layout()
plt.savefig(OUTDIR / "qa_metrics.png", dpi=200)
plt.close()

# Fig. 3: Compression ratio histogram from sample summaries
ratios = []
for s in sumres.get("sample_summaries", [])[:200]:
    r = s.get("compression_ratio")
    if isinstance(r, (int, float)) and math.isfinite(r):
        ratios.append(r)

plt.figure(figsize=(6,4))
if ratios:
    plt.hist(ratios, bins=10, color="#76b7b2", edgecolor="#333333")
else:
    # fallback single bar
    plt.bar(["no-data"], [1], color="#76b7b2")
plt.xlabel("Compression ratio (summary_len / orig_len)")
plt.ylabel("Frequency")
plt.title("Summary Compression Ratios")
plt.grid(axis="y", linestyle=":", alpha=0.5)
plt.tight_layout()
plt.savefig(OUTDIR / "compression_hist.png", dpi=200)
plt.close()

# Fig. 4: Language distribution pie
langdist = langres.get("language_distribution", {})
plt.figure(figsize=(5,5))
if langdist:
    labels = list(langdist.keys())
    sizes = list(langdist.values())
    plt.pie(sizes, labels=labels, autopct="%1.0f%%", startangle=140)
else:
    plt.pie([1], labels=["n/a"], autopct="%1.0f%%")
plt.title("Language Distribution in Test Set")
plt.tight_layout()
plt.savefig(OUTDIR / "language_pie.png", dpi=200)
plt.close()

# Fig. 5: Pipeline Gantt (using illustrative per-stage means)
# Use paper's illustrative values if per-stage logs are absent
ocr = 1.8
emb = 0.4
search = 0.05
qa = 0.2
starts = [0, ocr, ocr + emb, ocr + emb + search]
lengths = [ocr, emb, search, qa]
labels = ["OCR", "Embedding", "FAISS Search", "QA/Summary"]
colors = ["#4e79a7", "#59a14f", "#edc948", "#e15759"]

plt.figure(figsize=(8,3))
for i, (s, l, c) in enumerate(zip(starts, lengths, colors)):
    plt.barh([0], [l], left=[s], color=c, edgecolor="#333333")
plt.yticks([])
plt.xlabel("Seconds")
plt.title("Pipeline Gantt (Illustrative)")
for s, l, label in zip(starts, lengths, labels):
    plt.text(s + l/2, 0, label, va="center", ha="center", color="white", fontsize=9)
plt.tight_layout()
plt.savefig(OUTDIR / "pipeline_gantt.png", dpi=200)
plt.close()

print(f"Figures written to {OUTDIR}")
