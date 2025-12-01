# PDF Conversion Instructions for NEOX Infinity Specification

## Files Available

1. **NEOX_INFINITY_DETAILED_SPECIFICATION.md** (118 KB) - Complete detailed specification
2. **NEOX_Infinity_WorkItems.csv** (4.6 KB) - CSV for Azure DevOps import

---

## Method 1: Install Pandoc (Recommended)

### Install Pandoc on macOS:
```bash
brew install pandoc
```

### Convert to PDF:
```bash
pandoc NEOX_INFINITY_DETAILED_SPECIFICATION.md -o NEOX_Infinity_Specification.pdf --pdf-engine=wkhtmltopdf
```

Or simpler (using default engine):
```bash
pandoc NEOX_INFINITY_DETAILED_SPECIFICATION.md -o NEOX_Infinity_Specification.pdf
```

### With Table of Contents:
```bash
pandoc NEOX_INFINITY_DETAILED_SPECIFICATION.md -o NEOX_Infinity_Specification.pdf --toc --toc-depth=3
```

---

## Method 2: Online Converters (No Installation Required)

### Option A: MarkdownToPDF
1. Visit: https://www.markdowntopdf.com/
2. Upload `NEOX_INFINITY_DETAILED_SPECIFICATION.md`
3. Click "Convert to PDF"
4. Download the generated PDF

### Option B: MD2PDF
1. Visit: https://md2pdf.netlify.app/
2. Paste the markdown content or upload file
3. Download PDF

### Option C: CloudConvert
1. Visit: https://cloudconvert.com/md-to-pdf
2. Upload `NEOX_INFINITY_DETAILED_SPECIFICATION.md`
3. Click "Convert"
4. Download PDF

### Option D: Dillinger
1. Visit: https://dillinger.io/
2. Import the markdown file
3. Export as PDF

---

## Method 3: Using VS Code (If you have it)

1. Install the "Markdown PDF" extension in VS Code
2. Open `NEOX_INFINITY_DETAILED_SPECIFICATION.md` in VS Code
3. Press `Cmd+Shift+P` (or `Ctrl+Shift+P` on Windows)
4. Type "Markdown PDF: Export (pdf)" and press Enter
5. PDF will be saved in the same directory

---

## Method 4: Using Marked 2 (macOS app)

If you have Marked 2 installed:
1. Open the markdown file in Marked 2
2. File → Export as PDF
3. Choose location and save

---

## Method 5: Using Chrome/Edge Browser

1. Open the markdown file in VS Code with preview
2. Print the preview (Cmd+P)
3. Select "Save as PDF" as destination
4. Save the file

---

## Converting CSV to Excel

### Option 1: Open in Excel/Numbers
1. Open Microsoft Excel or Apple Numbers
2. File → Open
3. Select `NEOX_Infinity_WorkItems.csv`
4. The file will be imported automatically
5. Save As → Excel format (.xlsx)

### Option 2: Using Python (if needed)
```bash
pip3 install openpyxl pandas
python3 -c "import pandas as pd; df = pd.read_csv('NEOX_Infinity_WorkItems.csv'); df.to_excel('NEOX_Infinity_WorkItems.xlsx', index=False)"
```

### Option 3: Online Converter
Visit: https://cloudconvert.com/csv-to-xlsx
1. Upload the CSV file
2. Convert to XLSX
3. Download

---

## Recommended Workflow

**For PDF:**
1. Use online converter (fastest, no installation)
   - Go to https://www.markdowntopdf.com/
   - Upload the markdown file
   - Download PDF

**For Excel:**
1. Open CSV in Excel/Numbers
2. Save as .xlsx

---

## File Locations

All files are in:
```
/Users/petervarga/Projects/adminUI/neoxadminui/
```

- Markdown: `NEOX_INFINITY_DETAILED_SPECIFICATION.md`
- CSV: `NEOX_Infinity_WorkItems.csv`

---

## Quick Commands

```bash
# Navigate to directory
cd /Users/petervarga/Projects/adminUI/neoxadminui

# List files
ls -lh NEOX*

# Open in default markdown viewer
open NEOX_INFINITY_DETAILED_SPECIFICATION.md

# Open CSV in Excel
open NEOX_Infinity_WorkItems.csv
```

---

## Need Help?

If you encounter any issues with conversion, you can:
1. Share the markdown file with someone who has pandoc installed
2. Use one of the online converters (they work well for large files)
3. Install pandoc (one-time setup, works for all future conversions)

---

**Note**: The markdown file is already well-formatted and will convert nicely to PDF with any of these methods. The online converters are the fastest if you don't want to install software.
