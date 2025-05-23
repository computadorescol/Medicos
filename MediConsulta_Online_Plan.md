  # Plan del MVP: MediConsulta Online

## Objetivo Principal
Crear un MVP (Producto Mínimo Viable) para validar la idea de consultas médicas online, permitiendo a los pacientes agendar citas y a los médicos gestionar su disponibilidad y el estado de las citas.

## Tecnologías Clave
*   **Frontend:** React, TypeScript, CSS plano.
*   **Backend & Base de Datos:** Firebase (Authentication para usuarios, Firestore para la base de datos).

## Funcionalidades Clave del MVP

1.  **Autenticación (Firebase Authentication):**
    *   Registro de nuevos usuarios (Pacientes y Médicos).
    *   Inicio de Sesión para usuarios existentes.
    *   Manejo de sesión y distinción de roles (Paciente/Médico) en la aplicación.

2.  **Gestión de Perfiles (Firestore):**
    *   **Pacientes:**
        *   Creación de perfil básico al registrarse (nombre, email).
        *   (Opcional MVP) Posibilidad de ver/editar su información básica.
    *   **Médicos:**
        *   Creación de perfil más detallado al registrarse o posteriormente (nombre, email, especialidad, una breve descripción).
        *   Posibilidad de editar la información de su perfil.
        *   Funcionalidad para configurar y actualizar su disponibilidad horaria (ej. días de la semana y rangos horarios en los que atienden).

3.  **Flujo para Pacientes (Frontend + Interacción con Firestore):**
    *   Dashboard principal del paciente.
    *   Funcionalidad de búsqueda/listado de médicos (filtrable por especialidad, si es posible en el MVP).
    *   Visualización de perfiles básicos de los médicos.
    *   Visualización de la disponibilidad de un médico seleccionado (ej. en un calendario o lista de slots disponibles).
    *   Proceso para seleccionar un horario y agendar una cita.
    *   Visualización de sus citas agendadas (con su estado: pendiente, completada).

4.  **Flujo para Médicos (Frontend + Interacción con Firestore):**
    *   Dashboard principal del médico.
    *   Visualización de su lista de citas agendadas (ordenadas por fecha/hora).
    *   Funcionalidad para marcar una cita como "Completada". Esto actualizará el estado de la cita en Firestore.
    *   Acceso a la gestión de su perfil y su disponibilidad horaria.

## Estructura de Datos Sugerida en Firestore

*   **Colección `users`**:
    *   Documento por usuario (ID = UID de Firebase Auth).
    *   Campos: `email`, `name`, `role` ('patient' o 'doctor'), `specialty` (para médicos), `description` (para médicos), etc.
*   **Colección `availabilities`** (o subcolección dentro del perfil del médico):
    *   Documento por bloque de disponibilidad del médico.
    *   Campos: `doctorId`, `dayOfWeek` (ej. 'monday'), `startTime` (ej. '09:00'), `endTime` (ej. '17:00').
*   **Colección `appointments`**:
    *   Documento por cita.
    *   Campos: `patientId`, `doctorId`, `appointmentDateTime` (Timestamp), `status` ('scheduled', 'completed', 'cancelled_by_patient', 'cancelled_by_doctor'), `patientName`, `doctorName`, etc.

## Diagrama del Plan

```mermaid
graph TD
    A[Inicio: Definición del MVP Finalizado] --> FBase(Configuración Inicial de Firebase);
    FBase --> Auth(Firebase Authentication: Setup);
    FBase --> FSDef(Firestore: Definición de Estructura de Datos);
    
    FSDef --> UsersCol[Colección 'users' (Pacientes, Médicos)];
    FSDef --> AvailCol[Colección 'availabilities' (Disponibilidad Médicos)];
    FSDef --> AppCol[Colección 'appointments' (Citas con estado)];

    A --> FE(Desarrollo Frontend - React & TS & CSS Plano);
    
    FE --> FE_Auth(1. Autenticación UI: Registro, Login);
    FE_Auth -- Conecta con --> Auth;
    
    FE --> FE_Profiles(2. Gestión de Perfiles UI);
    FE_Profiles -- Lee/Escribe --> UsersCol;
    FE_Profiles -- Lee/Escribe --> AvailCol;
    
    FE --> FE_Patient(3. Flujo Paciente UI);
    FE_Patient -- Busca en --> UsersCol;
    FE_Patient -- Lee --> AvailCol;
    FE_Patient -- Crea/Lee --> AppCol;
    
    FE --> FE_Doctor(4. Flujo Médico UI);
    FE_Doctor -- Lee/Actualiza --> AppCol;
    FE_Doctor -- Gestiona --> UsersCol;
    FE_Doctor -- Gestiona --> AvailCol;
    
    FE_Auth --> Int(Integración Continua y Pruebas);
    FE_Profiles --> Int;
    FE_Patient --> Int;
    FE_Doctor --> Int;
    
    Int --> Deploy(Despliegue del MVP);
    Deploy --> Validate(Validación de la Idea);