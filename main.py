from db import engine
from db_conection import get_db

def test_connection():
    try:
        with engine.connect() as conn:
            result = conn.execute("SELECT NOW();")
            print("✅ Conexión exitosa:", result.fetchone())
    except Exception as e:
        print("Error al conectar:", e)

if __name__ == "__main__":
    test_connection()

# A

### asdasda