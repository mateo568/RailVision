import psycopg2
import os
from dotenv import load_dotenv
from pathlib import Path


# load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

def get_connection():
    try:
        connection = psycopg2.connect(
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
            database=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            sslmode="require"
        )
        print("Conectado correctamente a postgre")
        return connection
    except Exception as e:
        print("Error al conectar a postgre:", e)
        return None