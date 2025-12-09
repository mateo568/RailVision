from fastapi import APIRouter, HTTPException
from models.tren import Tren
from db_conection import get_connection

router = APIRouter(prefix="/trenes", tags=["Trenes"])

@router.get("/")
def get_trenes():
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")
    
    cursor = conn.cursor()
    cursor.execute("SELECT tren_id, codigo, modelo, capacidad_toneladas, estado FROM trenes;")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    trenes = [
        {
            "tren_id": r[0],
            "codigo": r[1],
            "modelo": r[2],
            "capacidad_toneladas": r[3],
            "estado": r[4]
        } for r in rows
    ]
    return {"trenes": trenes}


@router.post("/add")
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
        cursor.execute(query, (tren.codigo, tren.modelo, tren.capacidad_toneladas, tren.estado))
        new_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "success", "tren_id": new_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/update/{tren_id}")
def update_tren(tren_id: int, tren: Tren):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    try:
        cursor = conn.cursor()
        query = """
            UPDATE trenes
            SET codigo = %s, modelo = %s, capacidad_toneladas = %s, estado = %s
            WHERE tren_id = %s;
        """
        cursor.execute(query, (tren.codigo, tren.modelo, tren.capacidad_toneladas, tren.estado, tren_id))
        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "updated", "tren_id": tren_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/delete-tren/{tren_id}")
def delete_tren(tren_id: int):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")
    try:
        cursor = conn.cursor()
        query = "DELETE FROM trenes WHERE tren_id = %s;"
        cursor.execute(query, (tren_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))