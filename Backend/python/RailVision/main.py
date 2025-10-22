from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from db_conection import get_connection

app = FastAPI()

# 📦 Modelo de datos que recibirá la API
class Tren(BaseModel):
    codigo: str
    modelo: str
    capacidad_toneladas: float
    estado: str

@app.get("/")
def root():
    return {"message": "API funcionando correctamente 🚆"}


@app.get("/trenes")
def get_trenes():
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM trenes;")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return {"trenes": rows}


@app.post("/add-tren")
def add_tren(tren: Tren):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    try:
        cursor = conn.cursor()
        query = """
        INSERT INTO trenes (codigo, modelo, capacidad_toneladas, estado, fecha_creacion)
        VALUES (%s, %s, %s, %s, NOW())
        RETURNING tren_id;
        """
        cursor.execute(query, (
            tren.codigo,
            tren.modelo,
            tren.capacidad_toneladas,
            tren.estado
        ))
        new_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "success", "tren_id": new_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
