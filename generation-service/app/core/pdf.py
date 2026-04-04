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
