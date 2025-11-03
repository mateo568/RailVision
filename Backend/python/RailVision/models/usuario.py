from pydantic import BaseModel
from typing import Optional

class Usuario(BaseModel):
    usuario_id: Optional[int] = None
    nombre: str
    apellido: str
    email: str
    password_hash: str
    rol: str
    estado: bool
