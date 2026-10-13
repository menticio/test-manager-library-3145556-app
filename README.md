# test-manager-library-3145556-app

> **Prueba técnica · Ficha ADSO 3145556**
> Entrega: **martes 13 de octubre de 2026, a las 5:00 p. m.** (17:00, hora Colombia).

Este repositorio es el **frontend** de *Manager Library*, en **React**. **Empieza vacío a propósito**: se construye en el fork de cada aprendiz.

## Instrucciones

Cada aprendiz debe **crear el fork** de los seis repositorios del proyecto y **resolver el proyecto
con el spec planteado**.

1. Hacer fork, a su cuenta de GitHub, de cada repositorio de la tabla del final.
2. Leer el spec en [`test-manager-library-3145556-docs`](https://github.com/code-sena/test-manager-library-3145556-docs).
   Se entrega en dos versiones: `spec-python/` y `spec-.net/`.
3. Desarrollar en los forks.

## El reto se desarrolla con React y PHP (Laravel)

El spec está escrito para Python y para .NET, pero el reto **no** se hace en esos lenguajes:

| Capa | Tecnología del reto |
|---|---|
| Frontend | React |
| Backend | PHP con Laravel |

Lo que el spec define sobre el negocio —historias, criterios de aceptación, reglas, contrato de la
API, modelo de datos— se respeta. Lo que define sobre la tecnología se traduce a React y Laravel.

## La prueba no consiste en escribir el código

El propósito principal es ver la **capacidad de desempeño con SDD** (*Spec-Driven Development*,
desarrollo guiado por especificación): cómo se lee, se interpreta y se aplica una especificación
para llevarla a un stack distinto. El código es el medio, no el fin.

## Entrega

Cuenta lo que quede **subido a los forks antes de las 5:00 p. m.** (17:00). Lo que llegue después no se revisa.
No hay prórroga: suban avances parciales con commits pequeños durante la prueba.

## Los seis repositorios

| Repositorio | Qué va ahí |
|---|---|
| [`test-manager-library-3145556-docs`](https://github.com/code-sena/test-manager-library-3145556-docs) | El spec: `spec-python/` y `spec-.net/` |
| [`test-manager-library-3145556-api`](https://github.com/code-sena/test-manager-library-3145556-api) | Backend en PHP (Laravel) |
| [`test-manager-library-3145556-app`](https://github.com/code-sena/test-manager-library-3145556-app) | Frontend en React |
| [`test-manager-library-3145556-page`](https://github.com/code-sena/test-manager-library-3145556-page) | Sitio público estático de presentación |
| [`test-manager-library-3145556-infra`](https://github.com/code-sena/test-manager-library-3145556-infra) | Contenedores, red, volúmenes y motor de base de datos vacío |
| [`test-manager-library-3145556-tool`](https://github.com/code-sena/test-manager-library-3145556-tool) | Utilidades: sembrador de datos de demostración |

## Cómo correrlo (T-22)

```bash
cp .env.example .env     # VITE_API_URL=http://localhost:8000/api/v1
npm install
npm run dev              # http://localhost:5173 (el origen que la API permite por CORS)
```

React + Vite, sin librerías de UI. Solo habla con la API por el contrato (`src/api.js`); muestra el `message` en español
del cuerpo de error único. El token vive en `sessionStorage` y se descarta ante un 401.

| Pantalla | Rol | Historia |
|---|---|---|
| Ingresar | todos | HU-01 |
| Catálogo (buscar, crear, cambiar total, dar de baja) | buscar: ambos · cambios: admin | HU-03, HU-04 |
| Socios (buscar, crear) | admin, bibliotecario | HU-05 |
| Prestar (socio + 1 a 3 libros) | admin, bibliotecario | HU-06 |
| Préstamos y devoluciones (filtrar, devolver por línea) | admin, bibliotecario | HU-07, HU-08 |
| Vencidos | admin, bibliotecario | HU-09 |
| Más prestados | admin | HU-10 |
| Bibliotecarios (crear) | admin | HU-02 |

### Evidencia

Recorrido manual contra la API de `infra` (`docker compose up`): ingresar como admin → crear libro → crear socio →
prestar → devolver → reporte del mes con el libro prestado una vez.
