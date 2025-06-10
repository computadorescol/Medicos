# Project Template: Online Professional Consultation Platform

This is a starter template for building an online consultation platform for any type of professional (doctors, lawyers, architects, etc). It includes:

- **Frontend:** React + Vite + TypeScript
- **Backend:** Node.js (Vercel serverless functions) + Prisma + PostgreSQL
- **Authentication:** Firebase Auth (can be replaced)
- **Database:** Prisma ORM (PostgreSQL)

## How to Use This Template

1. **Clone this repo y renombra la carpeta:**
   - Cambia todos los nombres y rutas de "medicos" a tu dominio (ej: "abogados", "arquitectos").
2. **Personaliza los modelos:**
   - Edita `api/prisma/schema.prisma` para reflejar los campos de tu profesional (ej: especialidad, licencia, etc).
3. **Ajusta los endpoints:**
   - Cambia los nombres de endpoints y lógica en `api/` (ej: `/api/doctors` → `/api/professionals`).
4. **Actualiza el frontend:**
   - Cambia los textos, formularios y componentes en `frontend/src/components/` para tu dominio.
5. **Configura Firebase Auth o tu sistema de autenticación preferido.**
6. **Lee los comentarios en el código para más instrucciones.**

## Estructura de Carpetas

- `api/` - Backend (serverless functions, Prisma, endpoints REST)
- `frontend/` - Frontend (React, componentes, hooks)

## Ejemplo de Personalización

- Cambia `Doctor` por `Professional` en todos los archivos.
- Cambia `/api/doctors` por `/api/professionals`.
- Cambia los campos de perfil según tu necesidad.

---

**¡Listo para usar en cualquier vertical de servicios profesionales!**
