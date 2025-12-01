from fpdf import FPDF
from pathlib import Path
from bs4 import BeautifulSoup
from mistletoe import markdown

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
        font_dir = Path(__file__).parent
        pdf.add_font("NotoSans", "", font_dir / "NotoSans-Regular.ttf", uni=True)
        pdf.add_font("NotoSans", "B", font_dir / "NotoSans-Bold.ttf", uni=True)
        pdf.add_font("NotoSans", "I", font_dir / "NotoSans-Italic.ttf", uni=True)
        pdf.add_font("NotoSans", "BI", font_dir / "NotoSans-BoldItalic.ttf", uni=True)
        pdf.set_font("NotoSans", size=12)
        assert font_dir.exists(), "Font missing!"

        pdf.cell(200, 10, txt=self.title, ln=True, align="C")
        html = markdown(self.content)
        pdf.write_html(html)

        out = pdf.output(dest="S")
        if isinstance(out, str):
            out = out.encode("latin1")
        return out
