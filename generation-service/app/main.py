import re
from fastapi import FastAPI, Request, FastAPI
from fastapi.security import HTTPBearer
from keras.models import load_model
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
import google.generativeai as genai
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import pprint
from openai import OpenAI
from app.db_service.openapi_client.api.default_api import DefaultApi as DBService
from fpdf import FPDF
from app.storage_service.storage_service_client.api import (
    DefaultApi as StorageService,
)

from app.storage_service.storage_service_client.models.upload_file_request import (
    UploadFileRequest,
)
from app.core.pdf import PDFGenerator

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


@app.get("/")
async def read_root():
    return {"message": "Generation Service is up and running!"}


@app.post("/strategies")
async def generate_strategies(request: Request):
    model = load_model("./sentiment_analysis_model.h5")
    body = await request.json()
    company = body["company"]
    category = body["category"]

    # fetch data from db instead of request body
    db_service = DBService()
    storage_service = StorageService()
    query = company + " " + category
    productData = db_service.products_get(query)
    reviews = []
    productWithReviews = {}

    for item in productData:
        if "reviews" in item.keys():
            reviews.append(item["reviews"])
            productWithReviews[item["productName"]] = item["reviews"]

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
    message = openAIClient.responses.create(model="gpt-4.1", input=full_prompt)

    pdf_generator = PDFGenerator(
        title=f"{company} {category} Sentiment Analysis", content=message.output_text
    )
    data = pdf_generator.generate_pdf()
    print(data)
    upload_file_request = UploadFileRequest(
        filename=f"{company}_{category}_sentiment_analysis.pdf",
        filetype="application/pdf",
        data=data,
    )
    storage_service.root_post(
        upload_file_request=upload_file_request.to_dict(),
    )
    return {"sentiments": sentiments, "response": message.output_text}
