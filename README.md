# 🚆 RailVision

**RailVision** es una plataforma de gestión y monitoreo de viajes ferroviarios de carga.  
Permite administrar rutas, trenes, viajes, cargamentos y notificaciones, y visualizar métricas operativas en un **dashboard en tiempo casi real** mediante un **datamart basado en vistas materializadas**.

---

## 🎯 Objetivo del proyecto

- Centralizar la información de viajes ferroviarios
- Monitorear estados operativos de los viajes
- Visualizar métricas clave en un dashboard
- Simular escenarios reales para análisis y toma de decisiones
- Mantener integridad y trazabilidad de los datos

---

## 🧱 Arquitectura general

Frontend (Angular)
|
v
Backend (APIs + Jobs automáticos)
|
v
Base de Datos (PostgreSQL)
|
v
Frontend (Dashboard)
|
v
Datamart (Materialized Views)
|
v

---

## 🖥️ Frontend (Angular)

El frontend de RailVision está desarrollado en **Angular** y es el encargado de la interacción con el usuario.

### Funcionalidades principales del frontend

- Listado y gestión de trenes
- Creación de trenes mediante formularios
- Cambio de estado de trenes (activo / mantenimiento)
- Filtros por código, modelo y estado
- Paginación de resultados
- Visualización del estado operativo mediante badges
- Integración con el dashboard de métricas

### Comunicación con el backend

El frontend se comunica con el backend mediante servicios Angular (`HttpClient`), consumiendo endpoints REST como:

- `GET /trenes`
- `POST /trenes/add`
- `PUT /trenes/estado/{tren_id}`
- Endpoints de viajes, usuarios y dashboard

Los servicios encapsulan la lógica de acceso a datos y permiten mantener una separación clara entre UI y lógica de negocio.

### Tecnologías utilizadas

- Angular (standalone components)
- Angular Material (paginador)
- Bootstrap (layout, modales, dropdowns)
- SweetAlert2 (feedback visual al usuario)

---

## ⚙️ Backend

### Funcionalidades principales

- Autenticación de usuarios
- Gestión de viajes y cargamentos
- Cambio automático de estado de viajes
- Validaciones de integridad de datos
- Jobs programados para actualización de estados

### Cambio automático de estado

Un proceso automático evalúa los viajes y:
- Finaliza viajes cuando la `fecha_llegada` es menor a `NOW()`
- Ignora viajes cancelados
- Maneja valores `NULL` de forma defensiva

---

## 🗄️ Modelo de datos (resumen)

Principales entidades del sistema:

- **usuarios** → operadores, administradores y clientes
- **viajes** → entidad central del sistema
- **cargamentos** → carga asociada a cada viaje
- **rutas** → origen y destino entre estaciones
- **trenes** → capacidad y estado operativo
- **notificaciones / notificaciones_usuarios** → alertas por usuario
- **estaciones / ciudades** → geografía ferroviaria

> 🔒 El sistema prioriza **integridad referencial** y **borrado lógico** para entidades críticas como usuarios y viajes.

---

## 🔄 Estados de los viajes

| Estado       | Descripción |
|--------------|------------|
| programado   | Viaje planificado con horario estimado |
| en curso     | Viaje en ejecución (ETA disponible) |
| finalizado   | Viaje completado |
| cancelado    | Viaje cancelado |

📌 El campo `fecha_llegada` representa:
- **ETA** para viajes *programados* o *en curso*
- **Hora real de llegada** para viajes *finalizados*

---

## 📊 Datamart y Dashboard

RailVision utiliza **Materialized Views** como datamart para optimizar el rendimiento del dashboard.

Ejemplos de vistas materializadas:

- `dm_viajes`
- `dm_viajes_por_estado`
- `dm_carga_por_ruta`
- `dm_trenes_activos`

---

## 👤 Autor/es


DEV : Mateo Gabriel Acuña 
DEV : Agustin Abraham Louitaff

Proyecto RailVision.
