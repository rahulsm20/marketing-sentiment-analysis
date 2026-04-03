import base64
import json
import os
import re

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from py_packages.lib.methods import get_products
from tf_keras.models import load_model
from tf_keras.preprocessing.sequence import pad_sequences
from tf_keras.preprocessing.text import Tokenizer
from openai import OpenAI

from app.core.pdf import PDFGenerator
from app.core.redis import redis_client

from app.utils.constants import CACHE_KEY

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PROMPT = os.getenv("PROMPT")
openAIClient = OpenAI(api_key=OPENAI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-2.0-flash")


class LLM:
    def __init__(self, model_name):
        self.model = genai.GenerativeModel(model_name)

    def generate_text(self, text):
        response = self.model.generate_content(text)
        return response.text


token_auth_scheme = HTTPBearer()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


def to_titlecase(s: str) -> str:
    return re.sub(
        r"[A-Za-z]+('[A-Za-z]+)?",
        lambda mo: mo.group(0)[0].upper() + mo.group(0)[1:].lower(),
        s,
    )


@app.get("/")
async def read_root():
    return {"message": "Generation Service is up and running!"}


@app.post("/strategies")
async def generate_strategies(request: Request):
    model = load_model("./sentiment_analysis_model.h5")
    body = await request.json()
    company = body["company"]
    category = body["category"]

    # db_service = DBService()
    # storage_service = StorageService()
    query = company + " " + category
    product_data = get_products(session=None, query=query)
    reviews = []
    productWithReviews = {}
    products = [product.to_dict() for product in product_data]

    for product in products:
        product_reviews = product.get("reviews", "")
        reviews.append(product_reviews)
        productWithReviews[product["productName"]] = product_reviews

    tokenizer = Tokenizer()
    tokenizer.fit_on_texts(reviews)

    sequences = tokenizer.texts_to_sequences(reviews)
    max_sequence_length = 24
    padded_sequences = pad_sequences(sequences, maxlen=max_sequence_length)

    predictions = model.predict([padded_sequences, padded_sequences])
    sentiments = [
        "Positive" if pred >= 0.8 else "Mediocre" if pred >= 0.5 else "Negative"
        for pred in predictions
    ]

    reviews = [
        "product: "
        + product[:24]
        + ", reviews: "
        + ", ".join(productWithReviews[product])
        for product in productWithReviews
    ]

    joined_reviews = "////".join(reviews)

    prompt = PROMPT
    prompt = prompt.replace("{company}", company)
    prompt = prompt.replace("{category}", category)

    full_prompt = (
        prompt + " " + company + " " + category + " reviews: " + joined_reviews
    )
    cache_key = CACHE_KEY["MARKETING_STRATEGIES"](company=company, category=category)
    raw_cached_data = redis_client.get(cache_key)
    cache_hit = False
    cached_data = None
    if raw_cached_data:
        cached_data = json.loads(raw_cached_data)
        cache_hit = True
    else:
        message = openAIClient.responses.create(model="gpt-4.1", input=full_prompt)
        redis_client.set(
            cache_key,
            json.dumps({"sentiments": sentiments, "response": message.output_text}),
        )
        response = {"sentiments": sentiments, "output_text": message.output_text}

    if cache_hit and cached_data is not None:
        response = {
            "sentiments": cached_data["sentiments"],
            "output_text": cached_data["response"],
        }
    company = to_titlecase(company)
    category = to_titlecase(category)
    pdf_generator = PDFGenerator(
        title=f"{company} {category} Sentiment Analysis",
        content=response["output_text"],
        chart_data=sentiments,
        product_data=products,
    )
    data = pdf_generator.generate_pdf()
    encoded_data = base64.b64encode(data).decode("utf-8")

    # upload_file_request = UploadFileRequest(
    #     filename=f"{company}_{category}_sentiment_analysis.pdf",
    #     filetype="application/pdf",
    #     data=encoded_data,
    # )

    # file = storage_service.file_post_with_http_info(
    #     upload_file_request=upload_file_request.to_dict(),
    # )
    # file_data = json.loads(file.raw_data)
    # if not file or not file_data:
    #     raise Exception("File upload failed")

    return {
        "sentiments": response["sentiments"],
        "response": response["output_text"],
        # "file": file_data["url"],
    }
