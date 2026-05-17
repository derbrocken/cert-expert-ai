from docx import Document


def save_docx(title: str, content: str, output_path: str):

    doc = Document()

    doc.add_heading(title, level=1)

    doc.add_paragraph(content)

    doc.save(output_path)

    print(f"DOCX gespeichert: {output_path}")