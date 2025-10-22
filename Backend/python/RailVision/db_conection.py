import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    try:
        connection = psycopg2.connect(
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
            database=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
        )
        return connection
    except Exception as e:
        print("❌ Error al conectar a la base de datos:", e)
        return None
