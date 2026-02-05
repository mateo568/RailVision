from fastapi import APIRouter, HTTPException, Form
from models.usuario import Usuario
from db_conection import get_connection
from passlib.context import CryptContext
from passlib.hash import bcrypt


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


@router.get("/{usuario_id}")
def get_usuario(usuario_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT usuario_id, nombre, apellido, email, rol, estado FROM usuarios WHERE usuario_id = %s", (usuario_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return {
        "usuario_id": user[0],
        "nombre": user[1],
        "apellido": user[2],
        "email": user[3],
        "rol": user[4],
        "estado": user[5],
    }

# ------------------------------
# Crear nuevo usuario
# ------------------------------
@router.post("/add")
def add_usuario(
    nombre: str = Form(...),
    apellido: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    rol: str = Form(...),
    estado: bool = Form(...)
):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    if not password or len(password.strip()) == 0:
        raise HTTPException(status_code=400, detail="La contraseña no puede estar vacía")

    password_input = password[:72]
    password_hash = pwd_context.hash(password_input)

    try:
        cursor = conn.cursor()
        query = """
            INSERT INTO usuarios (nombre, apellido, email, password_hash, rol, estado, fecha_creacion)
            VALUES (%s, %s, %s, %s, %s, %s, NOW())
            RETURNING usuario_id;
        """

        cursor.execute(query, (
            nombre,
            apellido,
            email,
            password_hash,
            rol,
            estado
        ))

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
# @router.put("/update/{usuario_id}")
# def update_usuario(usuario_id: int, usuario: Usuario):
#     conn = get_connection()
#     if not conn:
#         raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

#     try:
#         cursor = conn.cursor()
#         query = """
#             UPDATE usuarios
#             SET nombre = %s,
#                 apellido = %s,
#                 email = %s,
#                 password_hash = %s,
#                 rol = %s,
#                 estado = %s
#             WHERE usuario_id = %s;
#         """
#         cursor.execute(query, (
#             usuario.nombre,
#             usuario.apellido,
#             usuario.email,
#             usuario.password_hash,
#             usuario.rol,
#             usuario.estado,
#             usuario_id
#         ))
#         conn.commit()
#         cursor.close()
#         conn.close()
#         return {"status": "updated", "usuario_id": usuario_id}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    

@router.put("/update/{usuario_id}")
def update_usuario(usuario_id: int, usuario: Usuario):

    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    try:
        cursor = conn.cursor()

        # Si viene contraseña, hashearla
        password_hash = None
        if usuario.password:
            password_hash = bcrypt.hash(usuario.password)
        else:
            # Mantener la contraseña actual
            cursor.execute("SELECT password_hash FROM usuarios WHERE usuario_id = %s", (usuario_id,))
            password_hash = cursor.fetchone()[0]

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
            password_hash,
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
# @router.delete("/delete/{usuario_id}")
# def delete_usuario(usuario_id: int):
#     conn = get_connection()
#     if not conn:
#         raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

#     try:
#         cursor = conn.cursor()
#         query = "DELETE FROM usuarios WHERE usuario_id = %s;"
#         cursor.execute(query, (usuario_id,))
#         conn.commit()
#         cursor.close()
#         conn.close()
#         return {"status": "deleted", "usuario_id": usuario_id}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))



@router.delete("/delete/{usuario_id}")
def delete_usuario(usuario_id: int):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    try:
        cursor = conn.cursor()

        cursor.execute(
            "UPDATE usuarios SET estado = false WHERE usuario_id = %s;",
            (usuario_id,)
        )

        conn.commit()
        cursor.close()
        conn.close()

        return {"status": "disabled", "usuario_id": usuario_id}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))