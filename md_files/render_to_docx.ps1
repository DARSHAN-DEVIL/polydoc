Add-Type -AssemblyName System.Web
$md = 'C:\darshan\polydoc\md_files\PolyDoc_Research_Paper.md'
$html = 'C:\darshan\polydoc\md_files\PolyDoc_Research_Paper_rendered.html'
$docx = 'C:\darshan\polydoc\md_files\PolyDoc_Research_Paper.docx'

$lines = (Get-Content -LiteralPath $md -Raw -Encoding UTF8) -split "`r?`n"
$body = ''
$inList = $false
$inCode = $false

foreach ($line in $lines) {
  if ($line -match '^```') {
    if (-not $inCode) { $body += '<pre><code>'; $inCode = $true } else { $body += '</code></pre>'; $inCode = $false }
    continue
  }
  if ($inCode) { $body += [System.Web.HttpUtility]::HtmlEncode($line) + "`n"; continue }
  if ($line -match '^# (.+)')   { if ($inList) { $body += '</ul>'; $inList=$false }; $body += '<h1>'+[System.Web.HttpUtility]::HtmlEncode($matches[1])+'</h1>'; continue }
  if ($line -match '^## (.+)')  { if ($inList) { $body += '</ul>'; $inList=$false }; $body += '<h2>'+[System.Web.HttpUtility]::HtmlEncode($matches[1])+'</h2>'; continue }
  if ($line -match '^### (.+)') { if ($inList) { $body += '</ul>'; $inList=$false }; $body += '<h3>'+[System.Web.HttpUtility]::HtmlEncode($matches[1])+'</h3>'; continue }
  if ($line -match '^-\s+(.+)') { if (-not $inList) { $body += '<ul>'; $inList=$true }; $body += '<li>'+[System.Web.HttpUtility]::HtmlEncode($matches[1])+'</li>'; continue }
  if ([string]::IsNullOrWhiteSpace($line)) { if ($inList) { $body += '</ul>'; $inList=$false }; $body += '<br/>'; continue }
  $body += '<p>'+[System.Web.HttpUtility]::HtmlEncode($line)+'</p>'
}
if ($inList) { $body += '</ul>' }

$htmlDoc = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>PolyDoc Research Paper</title><style>body{font-family:Calibri,Arial,Helvetica,sans-serif;line-height:1.3} h1,h2,h3{font-weight:600} ul{margin:0 0 0.5em 1.2em} pre{background:#f7f7f7;padding:8px;border:1px solid #ddd;white-space:pre-wrap}</style></head><body>'+ $body +'</body></html>'
Set-Content -LiteralPath $html -Value $htmlDoc -Encoding UTF8

# Word COM conversion and formatting
$word = $null
try {
  $word = New-Object -ComObject Word.Application
  $word.Visible = $false
  $doc = $word.Documents.Open($html)
  
  # Cover page
  $sel = $word.Selection
  $sel.HomeKey(6) | Out-Null  # wdStory
  $sel.TypeText('PolyDoc AI: A Free, Self-Hosted Multilingual Document Understanding System with Specialized Indic Language Support')
  $sel.ParagraphFormat.Alignment = 1       # wdAlignParagraphCenter
  $sel.Font.Size = 20; $sel.Font.Bold = $true
  $sel.TypeParagraph()
  $sel.Font.Bold = $false; $sel.Font.Size = 12
  $sel.TypeText('Authors: Darshan et al.')
  $sel.TypeParagraph()
  $sel.TypeText('Affiliation: PolyDoc AI Project')
  $sel.TypeParagraph()
  $sel.TypeText('Date: ' + (Get-Date -Format 'yyyy-MM-dd'))
  $sel.TypeParagraph()
  $sel.TypeText('Keywords: Multilingual OCR, Indic Scripts, NLP, RAG, FAISS, FastAPI')
  $sel.TypeParagraph()
  $sel.InsertBreak(7) | Out-Null          # wdPageBreak

  # Header/Footer
  $sec = $doc.Sections(1)
  $sec.PageSetup.DifferentFirstPageHeaderFooter = $true
  $hdr = $sec.Headers(1)                   # wdHeaderFooterPrimary
  $hdr.Range.Text = 'PolyDoc AI - Multilingual Document Understanding'
  $hdr.Range.ParagraphFormat.Alignment = 1
  $ftr = $sec.Footers(1)
  $ftr.Range.ParagraphFormat.Alignment = 1
  [void]$ftr.Range.Fields.Add($ftr.Range,33)  # wdFieldPage

  # Save as DOCX
  $doc.SaveAs([ref]$docx, [ref]16)         # wdFormatDocumentDefault
  $doc.Close()
  $word.Quit()
  Write-Output 'DOCX_UPDATED'
} catch {
  if ($word) { $word.Quit() }
  Write-Output 'WORD_FAIL'
  Write-Output $_.Exception.Message
}
