FROM python:3.10-slim

WORKDIR /app

# Copiar dependencias
COPY ./RailVision/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente
COPY ./RailVision/. .
COPY ./RailVision/.env ./.env

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
