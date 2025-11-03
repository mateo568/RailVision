from fastapi import APIRouter, HTTPException
from models.usuario import Usuario
from db_conection import get_connection

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

# ------------------------------
# Consultar todos los usuarios
# ------------------------------
@router.get("/")
def get_usuarios():
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    cursor = conn.cursor()
    cursor.execute("SELECT usuario_id, nombre, apellido, email, rol, estado FROM usuarios;")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    usuarios = [
        {
            "usuario_id": r[0],
            "nombre": r[1],
            "apellido": r[2],
            "email": r[3],
            "rol": r[4],
            "estado": r[5]
        } for r in rows
    ]
    return {"usuarios": usuarios}


# ------------------------------
# Crear nuevo usuario
# ------------------------------
@router.post("/add")
def add_usuario(usuario: Usuario):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    try:
        cursor = conn.cursor()
        query = """
            INSERT INTO usuarios (nombre, apellido, email, password_hash, rol, estado, fecha_creacion)
            VALUES (%s, %s, %s, %s, %s, %s, NOW())
            RETURNING usuario_id;
        """
        cursor.execute(query, (usuario.nombre, usuario.apellido, usuario.email,
                               usuario.password_hash, usuario.rol, usuario.estado))
        new_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "success", "usuario_id": new_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ------------------------------
# Actualizar usuario
# ------------------------------
@router.put("/update/{usuario_id}")
def update_usuario(usuario_id: int, usuario: Usuario):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    try:
        cursor = conn.cursor()
        query = """
            UPDATE usuarios
            SET nombre = %s,
                apellido = %s,
                email = %s,
                password_hash = %s,
                rol = %s,
                estado = %s
            WHERE usuario_id = %s;
        """
        cursor.execute(query, (
            usuario.nombre,
            usuario.apellido,
            usuario.email,
            usuario.password_hash,
            usuario.rol,
            usuario.estado,
            usuario_id
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "updated", "usuario_id": usuario_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ------------------------------
# Eliminar usuario
# ------------------------------
@router.delete("/delete/{usuario_id}")
def delete_usuario(usuario_id: int):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    try:
        cursor = conn.cursor()
        query = "DELETE FROM usuarios WHERE usuario_id = %s;"
        cursor.execute(query, (usuario_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "deleted", "usuario_id": usuario_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
