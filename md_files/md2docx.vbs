' Create Word DOCX from HTML (requires Microsoft Word installed)
Const wdFormatDocumentDefault = 16
Dim htmlPath, docxPath
htmlPath = "C:\darshan\polydoc\md_files\PolyDoc_Research_Paper.html"
docxPath = "C:\darshan\polydoc\md_files\PolyDoc_Research_Paper.docx"

On Error Resume Next
Dim word, doc
Set word = CreateObject("Word.Application")
If Err.Number <> 0 Then
  WScript.Echo "WORD_FAIL: Word not installed or not accessible"
  WScript.Quit 1
End If
On Error GoTo 0

word.Visible = False
Set doc = word.Documents.Open(htmlPath)
doc.SaveAs docxPath, wdFormatDocumentDefault
doc.Close False
word.Quit
WScript.Echo "WORD_OK"