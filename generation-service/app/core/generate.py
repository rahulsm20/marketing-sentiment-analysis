import json
import re
from py_packages.lib.methods import get_products, update_conversation, create_pdf_document
from tf_keras.models import load_model
from tf_keras.preprocessing.sequence import pad_sequences
from tf_keras.preprocessing.text import Tokenizer
from tf_keras.layers import Embedding
from app.core.pdf import PDFGenerator
from app.core.redis import redis_client
import os
from app.utils.constants import CACHE_KEY
from openai import OpenAI
from sqlmodel import Session
from py_packages.lib.db import engine
from py_packages.lib.s3 import upload_bytes
from py_packages.lib.methods import create_message

PROMPT = os.getenv("PROMPT")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openAIClient = OpenAI(api_key=OPENAI_API_KEY)



def to_titlecase(s: str) -> str:
    return re.sub(
        r"[A-Za-z]+('[A-Za-z]+)?",
        lambda mo: mo.group(0)[0].upper() + mo.group(0)[1:].lower(),
        s,
    )
    
async def generate(query: str, id:str):
    model = load_model("./sentiment_analysis_model.h5")
    with Session(engine) as session:
        products = get_products(session=session, query=query)
        reviews = []
        productWithReviews = {}
        company = query.split("+")[0]
        category = query.split("+")[1]
        
        for product in products:
            product_reviews = product.product_reviews
            for review in product_reviews:
                reviews.append(review.review_text)
            productWithReviews[product.name] = product_reviews
        embedding_layer = next(l for l in model.layers if isinstance(l, Embedding))
        vocab_size = embedding_layer.input_dim
        tokenizer = Tokenizer(num_words=vocab_size, oov_token="<OOV>")
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
            + ", ".join(r.review_text for r in productWithReviews[product] if r.review_text)
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
            print("Cache hit")
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

        file_name = f"{company}_{category}_sentiment_analysis.pdf"
        file_path = f"s3://market_sentience/{file_name}"
        doc = create_pdf_document(session=session, conversation_id=id, file_name=file_name, file_path=file_path)
        url = upload_bytes(data=data, bucket="market-sentience", key=f"{doc.id}_{company}_{category}_sentiment_analysis.pdf", content_type="application/pdf") 
        
        update_conversation(session=session, conversation_id=id, status='completed')
    
        response_text = f'Hello, we have analyzed the sentiment of the reviews for the products in the category {category} of {company}. \nPlease find the sentiment analysis report attached. {url}'
        create_message(session=session, conversation_id=id, content=response_text, role="assistant")
        result = {
            "sentiments": response["sentiments"],
            "response": response["output_text"],
            "file": url,
        }
        return result

