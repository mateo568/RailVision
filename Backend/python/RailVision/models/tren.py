from pydantic import BaseModel

class Tren(BaseModel):
    codigo: str
    modelo: str
    capacidad_toneladas: float
    estado: str