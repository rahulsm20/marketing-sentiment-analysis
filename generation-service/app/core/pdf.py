from fpdf import FPDF
from pathlib import Path

"""PDF generation utility.
Provides functionality to create PDFs from text content.

"""


class PDFGenerator:
    def __init__(self, title: str, content: str):
        self.title = title
        self.content = content

    """
    Generate a PDF and return its byte data.
    """

    def generate_pdf(self) -> bytearray:
        pdf = FPDF()
        pdf.add_page()
        font_path = Path(__file__).parent / "NotoSans.ttf"
        pdf.add_font("NotoSans", "", str(font_path), uni=True)
        pdf.set_font("NotoSans", size=12)

        pdf.cell(200, 10, txt=self.title, ln=True, align="C")
        pdf.multi_cell(0, 10, txt=self.content)

        return pdf.output(dest="S").encode("utf-8")
