FROM python:3.11.8-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN pip install tensorflow==2.15.0 fastapi python-dotenv uvicorn google-generativeai keras==2.15.0

COPY . /app/

EXPOSE 4000

CMD ["fastapi", "run", "--host", "0.0.0.0", "--port", "4000"]
