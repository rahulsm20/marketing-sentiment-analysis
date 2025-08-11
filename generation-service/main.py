from fastapi import FastAPI,Request, FastAPI  
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


load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PROMPT = os.getenv("PROMPT")
openAIClient = OpenAI(api_key=OPENAI_API_KEY)
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-2.0-flash')


class LLM():
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
    model = load_model('./sentiment_analysis_model.h5')
    body = await request.json()
    company = body["company"]
    category = body["category"]
    productData = body["productData"]
    reviews = []
    products = []
    
    for item in productData:
        if "reviews" in item.keys():
            reviews.append(item["reviews"])
            products.append(item["productName"])
    
    tokenizer = Tokenizer()
    tokenizer.fit_on_texts(reviews)
    
    sequences = tokenizer.texts_to_sequences(reviews)
    max_sequence_length = 24
    padded_sequences = pad_sequences(sequences, maxlen=max_sequence_length)
    
    predictions = model.predict([padded_sequences,padded_sequences])
    
    sentiments = ["Positive" if pred >= 0.8 else "Mediocre" if pred>=0.5 else "Negative" for pred in predictions]
    # pred_avg = [sum(predictions[i])/len(predictions[i]) for i,pred in predictions]
    reviews = [" ".join(item) for item in reviews]
    joined_reviews = "/".join(reviews)
    llm = LLM('gemini-2.0-flash')
    prompt = PROMPT
    prompt = prompt.replace("{company}", company)
    prompt = prompt.replace("{category}", category)

    full_prompt = prompt + " " + company + " " + category + " reviews: " + joined_reviews
    message = openAIClient.responses.create(
        model='gpt-4.1',
        input=full_prompt
    )
    print(full_prompt)
    
    response = llm.generate_text(full_prompt)
    return {"sentiments": sentiments, "response": message}
