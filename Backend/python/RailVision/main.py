from routers import trenes, usuarios
from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
from db_conection import get_connection
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # Agrega este import

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas las orígenes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "API funcionando correctamente"}

app.include_router(trenes.router)
app.include_router(usuarios.router)