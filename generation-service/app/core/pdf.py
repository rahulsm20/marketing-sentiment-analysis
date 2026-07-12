from re import I
from fpdf import FPDF
from pathlib import Path
from bs4 import BeautifulSoup
from mistletoe import markdown
import matplotlib
matplotlib.use("agg")
import matplotlib.pyplot as plt
from io import BytesIO

"""PDF generation utility.
Provides functionality to create PDFs from text content.

"""

from fpdf import FPDF

class ReportPDF(FPDF):
    def __init__(self, title):
        super().__init__()
        self.report_title = title
        self.set_auto_page_break(auto=True, margin=18)

    def header(self):
        # Logo (optional)
        image_dir = Path(__file__).parent
        self.image(f"{image_dir}/logo.png", 10, 8, 12)

        self.set_font("NotoSans", "B", 16)
        self.cell(0, 8, self.report_title, align="L", new_x="LMARGIN", new_y="NEXT")

        self.set_font("NotoSans", "", 9)
        self.set_text_color(120, 120, 120)
        self.cell(
            0,
            5,
            "Generated Analytics Report",
            align="L",
            new_x="LMARGIN",
            new_y="NEXT",
        )

        self.set_draw_color(220, 220, 220)
        self.line(10, self.get_y() + 2, 200, self.get_y() + 2)
        self.ln(8)

    def footer(self):
        self.set_y(-15)

        self.set_draw_color(220, 220, 220)
        self.line(10, self.get_y(), 200, self.get_y())

        self.ln(3)

        self.set_font("NotoSans", "", 9)
        self.set_text_color(120, 120, 120)

        self.cell(0, 5, f"Page {self.page_no()}", align="C")
        

class PDFGenerator:
    def __init__(self, title: str, content: str, chart_data=None, product_data=[]):
        self.title = title
        self.content = content
        self.chart_data = chart_data
        self.product_data = product_data

    """
    Generate a PDF and return its byte data.
    """

    def generate_pdf(self) -> bytearray:
        pdf = ReportPDF(self.title)
        font_dir = Path(__file__).parent
        pdf.add_font("NotoSans", "", font_dir / "NotoSans-Regular.ttf", uni=True)
        pdf.add_font("NotoSans", "B", font_dir / "NotoSans-Bold.ttf", uni=True)
        pdf.add_font("NotoSans", "I", font_dir / "NotoSans-Italic.ttf", uni=True)
        pdf.add_font("NotoSans", "BI", font_dir / "NotoSans-BoldItalic.ttf", uni=True)
        pdf.set_font("NotoSans", size=12)
        pdf.alias_nb_pages()
        pdf.set_title(self.title)
        pdf.set_author("Market Sentience")
        pdf.set_creator("Market Sentience")
        pdf.set_subject("Customer Sentiment Report")
        pdf.set_keywords("analytics, sentiment, report")
        assert font_dir.exists(), "Font missing!"
        pdf.add_page()

        pdf.cell(200, 10, txt=self.title, ln=True, align="C")

        positive = self.chart_data.count("Positive") if self.chart_data else 0
        negative = self.chart_data.count("Negative") if self.chart_data else 0
        mediocre = self.chart_data.count("Mediocre") if self.chart_data else 0
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 10))

        ax1.pie(
            [positive, negative, mediocre], explode=[0.1, 0.1, 0.1], autopct="%1.1f%%"
        )
        ax1.set_title("Sentiment Composition")
        ax1.legend(labels=["positive", "negative", "mediocre"])
        img_buffer = BytesIO()
        ax2.bar(
            ["Positive", "Negative", "Mediocre"],
            [positive, negative, mediocre],
            color=["green", "red", "orange"],
        )
        # self.product_data
        ax2.set_title("Sentiment Counts")

        # ax3.set_title("Products by Price")
        # product_names = (
        #     [p["productName"] for p in self.product_data] if self.product_data else []
        # )
        # product_prices = (
        #     [p["price"] for p in self.product_data] if self.product_data else []
        # )
        # # print(product_names, product_prices)
        # ax3.bar(product_names, product_prices, color="blue")
        img_buffer.seek(0)
        plt.savefig(img_buffer, format="PNG")
        plt.close(fig)

        pdf.ln(10)
        pdf.image(img_buffer, w=150)
        pdf.ln(5)

        html = markdown(self.content)
        pdf.write_html(html)

        out = pdf.output(dest="S")
        if isinstance(out, str):
            out = out.encode("latin1")
        return out
