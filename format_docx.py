import docx
from docx.shared import Pt, Inches
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def format_document(file_path):
    print(f"Loading document: {file_path}")
    doc = docx.Document(file_path)

    # 1. Set A4 Size (21cm x 29.7cm) & Margins (1 inch / 2.54 cm) for all sections
    for section in doc.sections:
        section.page_width = Inches(8.27)   # A4 width
        section.page_height = Inches(11.69) # A4 height
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # 2. Modify default style fonts and line spacing
    # Normal style (Body Text)
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Times New Roman'
    style_normal.font.size = Pt(12)
    style_normal.paragraph_format.line_spacing = 1.15

    # Modify heading styles to also use Times New Roman
    for style_name in ['Heading 1', 'Heading 2', 'Heading 3', 'Title', 'Subtitle', 'List Paragraph']:
        if style_name in doc.styles:
            s = doc.styles[style_name]
            s.font.name = 'Times New Roman'
            if style_name == 'Heading 1':
                s.font.size = Pt(16)
                s.font.bold = True
            elif style_name == 'Heading 2':
                s.font.size = Pt(14)
                s.font.bold = True
            elif style_name == 'Heading 3':
                s.font.size = Pt(12)
                s.font.bold = True
            elif style_name == 'Title':
                s.font.size = Pt(24)
                s.font.bold = True
            elif style_name == 'List Paragraph':
                s.font.size = Pt(12)
                s.paragraph_format.line_spacing = 1.15

    # 3. Apply Times New Roman and spacing 1.15 to all paragraphs and runs explicitly
    for paragraph in doc.paragraphs:
        paragraph.paragraph_format.line_spacing = 1.15
        
        # Don't override title or heading sizes, but force font family to Times New Roman
        for run in paragraph.runs:
            run.font.name = 'Times New Roman'
            
            # Apply XML element settings to ensure word doesn't fallback to Calibri
            rPr = run._r.get_or_add_rPr()
            rFonts = OxmlElement('w:rFonts')
            rFonts.set(qn('w:ascii'), 'Times New Roman')
            rFonts.set(qn('w:hAnsi'), 'Times New Roman')
            rFonts.set(qn('w:cs'), 'Times New Roman')
            rFonts.set(qn('w:eastAsia'), 'Times New Roman')
            rPr.append(rFonts)

            # Ensure run has font size set
            if run.font.size is None:
                if not paragraph.style.name.startswith('Heading') and paragraph.style.name != 'Title':
                    run.font.size = Pt(12)

    # 4. Spacing and font in tables
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for paragraph in cell.paragraphs:
                    paragraph.paragraph_format.line_spacing = 1.15
                    for run in paragraph.runs:
                        run.font.name = 'Times New Roman'
                        
                        rPr = run._r.get_or_add_rPr()
                        rFonts = OxmlElement('w:rFonts')
                        rFonts.set(qn('w:ascii'), 'Times New Roman')
                        rFonts.set(qn('w:hAnsi'), 'Times New Roman')
                        rPr.append(rFonts)
                        
                        if run.font.size is None:
                            run.font.size = Pt(11) # Table text can be 11pt

    # Save changes
    doc.save(file_path)
    print(f"Successfully formatted: {file_path}")

if __name__ == "__main__":
    format_document('c:/Users/Thinkpad/kopikeliling/BisnisTIK_KMIPN2026_KopiKuy.docx')
