# Análisis Completo del Proyecto "Innovation Platforms"

**Fecha de análisis:** 26 de octubre de 2025  
**Proyecto Firebase actual:** `innovationplatforms`

---

## 1. CONFIGURACIÓN GENERAL DEL PROYECTO

### 1.1 Información Básica
- **Nombre del proyecto:** Innovation Platforms
- **Tipo:** Next.js 16.0.0 con TypeScript
- **Framework:** React 19.2.0
- **Estilos:** Tailwind CSS v4
- **Base de datos:** Firebase Firestore
- **Autenticación:** Firebase Authentication
- **Hosting:** Firebase Hosting
- **Funciones:** Firebase Cloud Functions (Node.js 18)

### 1.2 Archivos de Configuración Principal

#### `.firebaserc`
```json
{
  "projects": {
    "default": "innovationplatforms"
  }
}
```

#### `firebase.json`
- **Hosting:** Configurado para desplegar desde `/out`
- **Firestore:** Reglas en `firestore.rules`, índices en `firestore.indexes.json`
- **Rewrites:** 10 rutas configuradas (about, projects, services, contact, dashboard, research, library, login, register, profile)
- **Clean URLs:** Habilitado
- **Trailing Slash:** Deshabilitado

---

## 2. FIREBASE FIRESTORE

### 2.1 Estructura de Colecciones

#### **Colección: `users`**
```typescript
{
  id: string;
  email: string;
  name: string;
  affiliation?: string;
  orcidId?: string;
  googleScholarId?: string;
  researchInterests: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### **Colección: `research_projects`**
```typescript
{
  id: string;
  title: string;
  description: string;
  ownerId: string;
  collaborators: string[];
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  startDate: Timestamp;
  endDate?: Timestamp;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### **Colección: `papers`**
```typescript
{
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  doi?: string;
  pmid?: string;
  arxivId?: string;
  journal?: string;
  publicationDate: Timestamp;
  url?: string;
  pdfUrl?: string;
  tags: string[];
  citations?: number;
  impactFactor?: number;
  ownerId: string;
  projectId?: string;
  isRead: boolean;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### **Colección: `collaborations`**
```typescript
{
  id: string;
  projectId: string;
  participants: {
    [userId: string]: {
      userId: string;
      role: 'owner' | 'collaborator' | 'reviewer';
      joinedAt: Timestamp;
    }
  };
  lastActivity: Timestamp;
  messages: CollaborationMessage[];
  createdAt: Timestamp;
}
```

#### **Colección: `user_library`** (Subcolección)
```
user_library/{userId}/papers/{paperId}
{
  ...paperData
  addedAt: Timestamp;
}
```

#### **Colección: `analytics`**
```typescript
{
  userId: string;
  totalPapers: number;
  totalProjects: number;
  totalCollaborations: number;
  papersThisYear: number;
  citationsThisYear: number;
  hIndex?: number;
  lastUpdated: Timestamp;
}
```

### 2.2 Índices Compuestos

```json
[
  {
    "collectionGroup": "research_projects",
    "fields": [
      { "fieldPath": "ownerId", "order": "ASCENDING" },
      { "fieldPath": "createdAt", "order": "DESCENDING" }
    ]
  },
  {
    "collectionGroup": "papers",
    "fields": [
      { "fieldPath": "ownerId", "order": "ASCENDING" },
      { "fieldPath": "publicationDate", "order": "DESCENDING" }
    ]
  },
  {
    "collectionGroup": "papers",
    "fields": [
      { "fieldPath": "tags", "arrayConfig": "CONTAINS" },
      { "fieldPath": "publicationDate", "order": "DESCENDING" }
    ]
  },
  {
    "collectionGroup": "collaborations",
    "fields": [
      { "fieldPath": "participants", "arrayConfig": "CONTAINS" },
      { "fieldPath": "lastActivity", "order": "DESCENDING" }
    ]
  }
]
```

### 2.3 Reglas de Seguridad de Firestore

**Principio de seguridad:** Acceso basado en autenticación y propiedad de recursos

#### **Reglas para `users`**
- Solo el propietario puede leer y escribir su documento

#### **Reglas para `research_projects`**
- Lectura: Propietario o colaboradores
- Creación: Usuario autenticado (debe ser el propietario)
- Actualización/Eliminación: Solo el propietario

#### **Reglas para `papers`**
- Lectura: Propietario o colaboradores
- Creación: Usuario autenticado (debe ser el propietario)
- Actualización/Eliminación: Solo el propietario

#### **Reglas para `user_library`**
- Lectura/Escritura: Solo el propietario del userId

#### **Reglas para `collaborations`**
- Lectura/Escritura: Solo participantes del documento

#### **Reglas para `analytics`**
- Lectura: Cualquier usuario autenticado
- Escritura: Solo el propietario de los datos (userId)

---

## 3. FIREBASE AUTHENTICATION

### 3.1 Proveedores Configurados
- **Email/Password:** Habilitado (principal método)
- Otros proveedores: A verificar en Firebase Console

### 3.2 Configuración en el Cliente
```typescript
// lib/firebase.ts
import { getAuth } from 'firebase/auth';

export const auth = getAuth(app);
```

### 3.3 Contexto de Autenticación
- **Archivo:** `contexts/AuthContext.tsx`
- Gestiona estado de autenticación global
- Proporciona funciones de login/logout/register

---

## 4. FIREBASE CLOUD FUNCTIONS

### 4.1 Dependencias
```json
{
  "firebase-admin": "^13.5.0",
  "firebase-functions": "^6.6.0",
  "node": "18"
}
```

### 4.2 Funciones Desplegadas

#### **1. `helloWorld`**
- **Tipo:** HTTPS onRequest
- **Propósito:** Función de prueba
- **URL:** `https://us-central1-innovationplatforms.cloudfunctions.net/helloWorld`

#### **2. `getResearchMetrics`**
- **Tipo:** HTTPS onRequest
- **Propósito:** Obtener métricas de investigación
- **Consultas:**
  - Total de papers
  - Total de proyectos
  - Colaboraciones activas
- **URL:** `https://us-central1-innovationplatforms.cloudfunctions.net/getResearchMetrics`

#### **3. `searchExternalPapers`**
- **Tipo:** HTTPS onRequest
- **Propósito:** Búsqueda en APIs externas (placeholder)
- **Parámetros:** `query`, `source`
- **URL:** `https://us-central1-innovationplatforms.cloudfunctions.net/searchExternalPapers`

#### **4. `translateText`**
- **Tipo:** HTTPS onRequest
- **Propósito:** Proxy para traducción con LibreTranslate
- **CORS:** Habilitado
- **API externa:** `https://libretranslate.de/translate`
- **Parámetros:**
  - `q`: Texto a traducir
  - `source`: Idioma origen (auto por defecto)
  - `target`: Idioma destino
  - `format`: Formato del texto
- **URL:** `https://us-central1-innovationplatforms.cloudfunctions.net/translateText`

### 4.3 Variables de Entorno de Functions
- No hay variables de entorno configuradas actualmente en Functions
- Las funciones utilizan credenciales de Firebase Admin automáticamente

---

## 5. FIREBASE STORAGE

### 5.1 Uso Actual
- **Storage bucket:** `innovationplatforms.appspot.com`
- Configurado en `lib/firebase.ts`
- No hay reglas de seguridad definidas explícitamente (usar configuración por defecto)

### 5.2 Uso Previsto
- Almacenamiento de PDFs de papers
- Archivos adjuntos en proyectos
- Avatares de usuario (potencial)

---

## 6. CONFIGURACIÓN DEL CLIENTE

### 6.1 Variables de Entorno Requeridas
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Scientific APIs (Optional)
CROSSREF_API_KEY=your_crossref_key_here
PUBMED_API_KEY=your_pubmed_key_here
OPENAI_API_KEY=your_openai_key_here

# OJS Integration
NEXT_PUBLIC_OJS_BASE_URL=https://relaticpanama.org/_journals
NEXT_PUBLIC_OJS_API_KEY=your_ojs_api_key
NEXT_PUBLIC_OJS_API_SECRET=your_ojs_api_secret
```

### 6.2 Servicios del Cliente

#### **ScientificDataService** (`services/scientificData.ts`)
- CRUD para usuarios, proyectos, papers, colaboraciones
- Búsqueda y filtrado
- Métricas del dashboard

#### **PaperSearchService** (`services/paperSearchService.ts`)
- Búsqueda en CrossRef
- Búsqueda en PubMed
- Normalización de datos

#### **OJSAPIService** (`services/ojsAPI.ts`)
- Integración con Open Journal Systems
- Envío de papers a revista
- Autenticación con API RESTful de OJS

#### **MetricsService** (`services/metricsService.ts`)
- Cálculo de métricas científicas
- Analytics del usuario

---

## 7. ESTRUCTURA DE LA APLICACIÓN

### 7.1 Páginas (App Router)
```
app/
├── page.tsx              # Home / Landing page
├── about/page.tsx        # Información sobre el proyecto
├── contact/page.tsx      # Formulario de contacto
├── dashboard/page.tsx    # Dashboard del usuario (protegida)
├── library/page.tsx      # Biblioteca de papers (protegida)
├── login/page.tsx        # Inicio de sesión
├── register/page.tsx     # Registro de usuario
├── profile/page.tsx      # Perfil de usuario (protegida)
├── projects/page.tsx     # Proyectos de investigación (protegida)
├── research/page.tsx     # Gestor de investigación (protegida)
└── services/page.tsx     # Servicios ofrecidos
```

### 7.2 Componentes Principales

#### **Autenticación**
- `AuthContext.tsx` - Contexto global de autenticación
- `LoginForm.tsx` - Formulario de inicio de sesión
- `RegisterForm.tsx` - Formulario de registro
- `UserProfile.tsx` - Perfil de usuario editable
- `ProtectedRoute.tsx` - HOC para rutas protegidas

#### **Científicos**
- `AddPaperForm.tsx` - Formulario para agregar papers
- `LibraryManager.tsx` - Gestor de biblioteca personal
- `ResearchManager.tsx` - Gestor de proyectos de investigación
- `DashboardShell.tsx` - Shell del dashboard

#### **UI General**
- `Navbar.tsx` - Barra de navegación
- `Sidebar.tsx` - Barra lateral
- `Footer.tsx` - Pie de página
- `ContactForm.tsx` - Formulario de contacto (referencia de diseño)
- `LanguageSelector.tsx` - Selector de idioma

### 7.3 Contextos
- **AuthContext:** Gestión de estado de autenticación
- **TranslationContext:** Gestión de traducciones multiidioma

---

## 8. DEPENDENCIAS DEL PROYECTO

### 8.1 Dependencias de Producción
```json
{
  "firebase": "^12.4.0",
  "next": "16.0.0",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "react-icons": "^5.5.0"
}
```

### 8.2 Dependencias de Desarrollo
```json
{
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "16.0.0",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

---

## 9. SCRIPTS DE DEPLOYMENT

### 9.1 Scripts Disponibles

#### **package.json**
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "export": "next export"
}
```

#### **deploy-spark.sh**
Script de despliegue automático para Firebase Hosting

---

## 10. INTEGRACIONES EXTERNAS

### 10.1 APIs Científicas
- **CrossRef API:** Búsqueda de papers por DOI
- **PubMed API:** Búsqueda de artículos médicos
- **LibreTranslate API:** Traducción de texto (vía Cloud Function)

### 10.2 OJS (Open Journal Systems)
- **URL:** https://relaticpanama.org/_journals
- **Versión:** 3.4.0
- **Integración:** API RESTful (pendiente de configurar)
- **Funcionalidad:** Envío automático de papers a revista

---

## 11. DOCUMENTACIÓN ADICIONAL

### 11.1 Archivos de Documentación
- `README.md` - Información general del proyecto
- `FIREBASE_SETUP.md` - Guía de configuración de Firebase
- `DEPLOYMENT_INSTRUCTIONS.md` - Instrucciones de despliegue
- `DEPLOY_COMMANDS.md` - Comandos de despliegue
- `PLAN_SPARK_GUIDE.md` - Guía para plan Spark de Firebase
- `PRUEBAS_EJECUTADAS.md` - Registro de pruebas
- `REPORTE_FINAL_PRUEBAS.md` - Reporte de pruebas
- `RESUMEN_FIREBASE.md` - Resumen de configuración Firebase
- `OJS_INTEGRATION_STATUS.md` - Estado de integración con OJS
- `HOW_TO_GET_OJS_CREDENTIALS.md` - Guía para obtener credenciales OJS
- `FEATURE_ADDITIONS_SUMMARY.md` - Resumen de funcionalidades añadidas

---

## 12. ESTADO ACTUAL DEL PROYECTO

### 12.1 Funcionalidades Implementadas ✅
- Autenticación de usuarios (Email/Password)
- Gestión de perfil de usuario
- Agregar, editar, eliminar papers
- Biblioteca personal de papers
- Búsqueda de papers por DOI (CrossRef)
- Filtrado y búsqueda local de papers
- Dashboard con estadísticas
- Sistema de proyectos de investigación
- Interfaz multiidioma
- Formularios estandarizados con animaciones
- Diseño responsive completo
- Cloud Functions para métricas y traducción

### 12.2 Funcionalidades en Desarrollo 🚧
- Integración con OJS (requiere configurar API)
- Colaboraciones entre usuarios
- Sistema de notificaciones
- Exportación de bibliografías
- Análisis de métricas avanzadas (h-index, etc.)

### 12.3 Desafíos Identificados ⚠️
- OJS RESTful API requiere habilitación manual
- Credenciales OJS expuestas (requieren cambio urgente)
- Storage rules no definidas explícitamente
- Búsqueda de texto completo limitada (considerar Algolia)

---

## 13. RESUMEN DE RECURSOS FIREBASE

### 13.1 Servicios en Uso
- ✅ Firebase Authentication
- ✅ Cloud Firestore
- ✅ Cloud Storage
- ✅ Cloud Functions (4 funciones)
- ✅ Firebase Hosting
- ❌ Realtime Database (no usado)
- ❌ Cloud Messaging (no usado)
- ❌ Remote Config (no usado)

### 13.2 Plan de Firebase
- **Actual:** Plan Spark (gratuito) o Blaze (pay-as-you-go)
- **Archivos de configuración:** 
  - `firebase.spark.json`
  - `firebase.blaze.json`
  - `firebase.backup.json`

---

## 14. SEGURIDAD

### 14.1 Nivel de Seguridad Actual
- ✅ Reglas de Firestore bien definidas (basadas en propiedad)
- ✅ Autenticación requerida para todas las operaciones sensibles
- ⚠️ Storage rules por defecto (revisar)
- ⚠️ Cloud Functions sin autenticación (considerar auth en endpoints sensibles)
- ❌ Credenciales OJS expuestas (requiere cambio inmediato)

### 14.2 Recomendaciones de Seguridad
1. Cambiar contraseña de OJS expuesta
2. Implementar API Keys para Cloud Functions públicas
3. Revisar y definir Storage rules explícitamente
4. Implementar rate limiting en funciones públicas
5. Configurar CORS específico por dominio en producción

---

## 15. MÉTRICAS Y MONITOREO

### 15.1 Herramientas de Monitoreo
- Firebase Console (métricas integradas)
- Cloud Functions logs
- Authentication logs
- Firestore usage metrics

### 15.2 KPIs a Monitorear
- Usuarios activos
- Papers agregados por usuario
- Proyectos creados
- Uso de Cloud Functions
- Errores de autenticación
- Latencia de queries

---

**Fin del Análisis**

Este documento proporciona una visión completa del estado actual del proyecto "Innovation Platforms" y servirá como base para la migración a "InnovaProyectos".



