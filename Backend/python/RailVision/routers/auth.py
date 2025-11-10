from fastapi import APIRouter, HTTPException, Depends, Form
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from db_conection import get_connection
import os

router = APIRouter(prefix="/auth", tags=["Autenticación"])

# Configuración de seguridad
SECRET_KEY = "super_secret_key"  # deberia ser una variable de entorno
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ----------------------
# Utilidades
# ----------------------

# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)

# def create_access_token(data: dict, expires_delta: timedelta | None = None):
#     to_encode = data.copy()
#     expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
#     to_encode.update({"exp": expire})
#     return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

## TEST LOGIN SIN HASH ##
@router.post("/login")
def login(email: str = Form(...), password: str = Form(...)):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    cursor = conn.cursor()
    cursor.execute(
        "SELECT usuario_id, email, password_hash, rol, estado FROM usuarios WHERE email = %s",
        (email,)
    )
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    usuario_id, email_db, password_db, rol, estado = user

    # sin hash para validar
    if password != password_db:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    if not estado:
        raise HTTPException(status_code=403, detail="Usuario inactivo")

    return {
        "status": "ok",
        "usuario_id": usuario_id,
        "email": email_db,
        "rol": rol
    }

# ----------------------
# Endpoint de login
# ----------------------

# @router.post("/login")
# def login(email: str, password: str):
#     conn = get_connection()
#     cursor = conn.cursor()

#     cursor.execute("SELECT usuario_id, email, password_hash, rol, estado FROM usuarios WHERE email = %s", (email,))
#     user = cursor.fetchone()

#     cursor.close()
#     conn.close()

#     if not user:
#         raise HTTPException(status_code=401, detail="Usuario no encontrado")

#     _, email_db, password_hash, rol, estado = user

#     if not estado:
#         raise HTTPException(status_code=403, detail="Usuario inactivo")

#     if not verify_password(password, password_hash):
#         raise HTTPException(status_code=401, detail="Contraseña incorrecta")

#     token_data = {"sub": email, "rol": rol}
#     access_token = create_access_token(token_data, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

#     return {"access_token": access_token, "token_type": "bearer", "rol": rol, "email": email}