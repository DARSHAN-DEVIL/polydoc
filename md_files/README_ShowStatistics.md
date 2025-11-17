# Show Statistics Feature

This document explains the UI changes that add a "Show Statistics" button to the Current Document card and a modal popup that displays document summary and statistics.

## What changed

- File updated: `src/pages/Dashboard.jsx`
  - Imported `BarChart2` icon from `lucide-react`.
  - Added state: `showStatsModal` (controls modal visibility).
  - Added a new button next to Download and Share:
    - Label: "Show Statistics"
    - Icon: `BarChart2`
    - Action: `setShowStatsModal(true)`
  - Implemented a modal component rendered at the bottom of the page:
    - Overlay with backdrop blur; closes on overlay click, Close button, or `X` icon.
    - Sections:
      - Document Information (Name, Size, Uploaded timestamp)
      - Summary (text)
      - Document Statistics (bulleted quick view)
      - Raw Statistics (pretty-printed JSON)

## Data sources

The modal reads from `currentDocument`, which is populated after a successful upload:

- `currentDocument.summary` — human‑readable summary returned by backend `/upload`.
- `currentDocument.statistics` — stats object returned by backend, e.g.:
  ```json
  {
    "total_elements": 20,
    "total_pages": 1,
    "element_types": {"paragraph": 20},
    "languages": {"en": 20},
    "avg_confidence": 1.0,
    "total_text_length": 1200,
    "chunks_added": 20
  }
  ```

If any field is missing, the UI shows a sensible default (e.g., “No summary available”).

## How to use

1. Upload a document from the chat input (upload‑only mode is shown until the first document is uploaded).
2. After processing, check the "Current Document" card in the right sidebar.
3. Click "Show Statistics" to open the modal with summary + statistics.
4. Close the modal using the `X`, outside click, or the "Close" button.

## UX details

- The modal size is capped to `70vh` with internal scrolling for long content.
- A compact bullet list provides quick stats (pages, language, total elements, paragraphs).
- JSON is shown in a monospace block for copy/paste.

## Future enhancements (optional)

- Fetch details for documents selected from the "Recent Documents" list (when `statistics`/`summary` is not present) via a new endpoint like `/documents/{document_id}`.
- Add copy buttons (copy summary, copy JSON) and export as `.json`.
- Show charts (counts per element type, language distribution) inline in the modal.

## QA checklist

- [ ] Upload returns `summary` and `statistics` in response and modal renders them.
- [ ] Modal opens/closes via all 3 routes (button, overlay click, X).
- [ ] Works in light/dark themes.
- [ ] No console errors when fields are absent (uses fallbacks).
