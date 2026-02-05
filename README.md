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
Frontend (Dashboard)
|
v
Datamart (Materialized Views)
|
v
Base de Datos (PostgreSQL)
|
v
Backend (APIs + Jobs automáticos)

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

## 📊 Datamart y Dashboard

RailVision utiliza **Materialized Views** como datamart para optimizar el rendimiento del dashboard.

Ejemplos de vistas materializadas:

- `dm_viajes`
- `dm_viajes_por_estado`
- `dm_carga_por_ruta`
- `dm_trenes_activos`

⚠️ Las materialized views **NO se actualizan automáticamente**.

---

## 🔄 Refresh del datamart

Para mantener el dashboard actualizado se utiliza una función SQL:

```sql
SELECT refresh_materialized_views();


## 👤 Autor/es
DEV : Mateo Gabriel Acuña 
DEV : Agustin Abraham Louitaff

Proyecto RailVision.
