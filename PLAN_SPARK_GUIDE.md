# 🆓 Guía: Trabajar con Firebase Plan Spark (Gratuito)

## 📋 Resumen del Problema

Tu proyecto tiene **Cloud Functions** configuradas, pero estas requieren el **Plan Blaze (pago)** porque necesitan:
- Artifact Registry API
- Cloud Build API

Esta guía te muestra cómo trabajar **100% gratis** usando solo el Plan Spark.

---

## ✅ Servicios Disponibles en Plan Spark

### Lo que SÍ puedes usar gratis:
- ✅ **Firebase Hosting** (tu sitio web estático)
- ✅ **Cloud Firestore** (base de datos NoSQL)
- ✅ **Firebase Authentication** (login de usuarios)
- ✅ **Firebase Storage** (almacenamiento de archivos)
- ✅ **Security Rules** (control de acceso)

### Lo que NO está disponible en Plan Spark:
- ❌ **Cloud Functions** (backend serverless)
- ❌ **APIs externas desde Functions** (llamadas HTTP salientes)

---

## 🔧 Solución 1: Desplegar Sin Functions (Recomendado)

### Paso 1: Renombrar firebase.json

\`\`\`bash
# Guardar el original (con functions) como backup
mv firebase.json firebase.blaze.json

# Usar la versión sin functions
cp firebase.spark.json firebase.json
\`\`\`

### Paso 2: Desplegar Hosting + Firestore

\`\`\`bash
# Desplegar solo hosting y firestore
firebase deploy --only hosting,firestore
\`\`\`

### Paso 3: Verificar

\`\`\`bash
# Ver tu sitio en:
https://innovationplatforms.web.app
# o
https://innovationplatforms.firebaseapp.com
\`\`\`

---

## 🔄 Alternativas a Cloud Functions

Las funciones que tenías planeadas se pueden reemplazar así:

### 1. **helloWorld** (prueba)
❌ **Cloud Function:**
\`\`\`typescript
export const helloWorld = functions.https.onRequest((req, res) => {
  res.send("Hello from Firebase!");
});
\`\`\`

✅ **Alternativa Frontend:**
\`\`\`typescript
// No necesitas esta función, era solo para pruebas
console.log("Hello from frontend!");
\`\`\`

---

### 2. **getResearchMetrics** (métricas)
❌ **Cloud Function:**
\`\`\`typescript
export const getResearchMetrics = functions.https.onRequest(async (req, res) => {
  const papersSnapshot = await db.collection('papers').get();
  res.json({ totalPapers: papersSnapshot.size });
});
\`\`\`

✅ **Alternativa Frontend con Firestore:**
\`\`\`typescript
// services/metricsService.ts
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function getResearchMetrics(userId: string) {
  // Obtener papers del usuario
  const papersQuery = query(
    collection(db, 'papers'),
    where('ownerId', '==', userId)
  );
  const papersSnapshot = await getDocs(papersQuery);
  
  // Obtener proyectos
  const projectsQuery = query(
    collection(db, 'research_projects'),
    where('ownerId', '==', userId)
  );
  const projectsSnapshot = await getDocs(projectsQuery);
  
  return {
    totalPapers: papersSnapshot.size,
    totalProjects: projectsSnapshot.size,
    // ... más métricas
  };
}
\`\`\`

**Ventajas:**
- ✅ Gratis
- ✅ Más rápido (no hay round-trip al servidor)
- ✅ Funciona offline con Firestore cache

---

### 3. **searchExternalPapers** (búsqueda de papers)
❌ **Cloud Function** (requiere llamadas HTTP salientes)

✅ **Alternativa 1: API Directa desde el Frontend**

\`\`\`typescript
// services/paperSearchService.ts
export async function searchCrossRef(query: string) {
  const response = await fetch(
    \`https://api.crossref.org/works?query=\${encodeURIComponent(query)}&rows=10\`,
    {
      headers: {
        'User-Agent': 'InnovaProyectos/1.0 (mailto:tu@email.com)'
      }
    }
  );
  
  const data = await response.json();
  return data.message.items;
}

export async function searchSemanticScholar(query: string) {
  const response = await fetch(
    \`https://api.semanticscholar.org/graph/v1/paper/search?query=\${encodeURIComponent(query)}&limit=10\`
  );
  
  const data = await response.json();
  return data.data;
}
\`\`\`

**APIs Gratuitas sin autenticación:**
- ✅ [CrossRef](https://api.crossref.org/) - 50 requests/segundo
- ✅ [Semantic Scholar](https://api.semanticscholar.org/) - Sin límite
- ✅ [arXiv](https://arxiv.org/help/api/) - 3 requests/segundo
- ✅ [PubMed](https://www.ncbi.nlm.nih.gov/home/develop/api/) - Sin API key para búsquedas básicas

✅ **Alternativa 2: Proxy Gratuito (si hay CORS)**

Si las APIs tienen problemas de CORS, usa un proxy gratuito:

\`\`\`typescript
// Usando AllOrigins (gratis, sin límite)
export async function searchWithProxy(apiUrl: string) {
  const proxyUrl = \`https://api.allorigins.win/get?url=\${encodeURIComponent(apiUrl)}\`;
  const response = await fetch(proxyUrl);
  const data = await response.json();
  return JSON.parse(data.contents);
}
\`\`\`

**Proxies CORS gratuitos:**
- [AllOrigins](https://allorigins.win/) - Sin límite
- [CORS Anywhere](https://cors-anywhere.herokuapp.com/) - 200 req/hora

---

### 4. **translateText** (traducción)
❌ **Cloud Function** como proxy a LibreTranslate

✅ **Alternativa 1: LibreTranslate Directo (si permite CORS)**

\`\`\`typescript
// services/translationService.ts
export async function translateText(text: string, targetLang: string) {
  const response = await fetch('https://libretranslate.com/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: text,
      source: 'auto',
      target: targetLang,
      format: 'text'
    })
  });
  
  const data = await response.json();
  return data.translatedText;
}
\`\`\`

✅ **Alternativa 2: APIs de Traducción Gratuitas**

\`\`\`typescript
// Usando MyMemory (gratis hasta 1000 words/día)
export async function translateWithMyMemory(text: string, targetLang: string) {
  const response = await fetch(
    \`https://api.mymemory.translated.net/get?q=\${encodeURIComponent(text)}&langpair=auto|\${targetLang}\`
  );
  
  const data = await response.json();
  return data.responseData.translatedText;
}
\`\`\`

**APIs de traducción gratuitas:**
- ✅ [MyMemory](https://mymemory.translated.net/doc/spec.php) - 1000 palabras/día gratis
- ✅ [LibreTranslate](https://libretranslate.com/) - Gratis con límites
- ✅ Traducciones estáticas en el frontend (lo que ya tienes en TranslationContext)

---

## 🛡️ Seguridad con Firestore Rules

Ya que no tienes Cloud Functions, toda la seguridad debe estar en **Firestore Security Rules**. Tu archivo `firestore.rules` ya está bien configurado:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ✅ Los usuarios solo pueden leer/escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // ✅ Solo propietarios y colaboradores acceden a papers
    match /papers/{paperId} {
      allow read, write: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid || 
         request.auth.uid in resource.data.collaborators);
    }
    
    // ✅ Proyectos protegidos
    match /research_projects/{projectId} {
      allow read, write: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid || 
         request.auth.uid in resource.data.collaborators);
    }
  }
}
\`\`\`

**Reglas adicionales que puedes agregar:**

\`\`\`javascript
// Validar que los emails sean únicos
match /users/{userId} {
  allow create: if request.auth != null 
    && request.auth.uid == userId
    && request.resource.data.email is string
    && request.resource.data.email.matches('.*@.*\\\\..*');
    
  allow update: if request.auth != null 
    && request.auth.uid == userId
    // No permitir cambiar el email
    && request.resource.data.email == resource.data.email;
}

// Límite de papers por usuario
match /papers/{paperId} {
  allow create: if request.auth != null
    && request.resource.data.ownerId == request.auth.uid
    // Máximo 1000 papers por usuario
    && getAfter(/databases/$(database)/documents/users/$(request.auth.uid))
       .data.paperCount < 1000;
}
\`\`\`

---

## 🧪 Desarrollo Local con Emuladores

Para desarrollar sin gastar cuotas de Firebase:

### Paso 1: Instalar Emuladores

\`\`\`bash
firebase init emulators
# Selecciona: Firestore, Authentication, Hosting
\`\`\`

### Paso 2: Configurar

\`\`\`json
// firebase.json - agregar sección de emulators
{
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 5000
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
\`\`\`

### Paso 3: Ejecutar

\`\`\`bash
# Terminal 1: Emuladores
firebase emulators:start

# Terminal 2: Next.js
npm run dev
\`\`\`

### Paso 4: Conectar tu app a emuladores

\`\`\`typescript
// lib/firebase.ts
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Solo en desarrollo local
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}
\`\`\`

**Ventajas:**
- ✅ Desarrollo offline
- ✅ Sin gastar cuotas
- ✅ Datos de prueba sin afectar producción
- ✅ UI para ver datos en http://localhost:4000

---

## 📦 Estructura Recomendada del Proyecto

\`\`\`
innovation/
├── app/                      # Next.js pages
├── components/               # React components
├── contexts/                 # Auth, Translation
├── lib/
│   └── firebase.ts          # Firebase config
├── services/                 # ✨ Nuevos servicios
│   ├── metricsService.ts    # Reemplaza getResearchMetrics function
│   ├── paperSearchService.ts # Reemplaza searchExternalPapers function
│   └── translationService.ts # Opcional si necesitas más traducciones
├── types/
├── public/
├── firebase.json            # SIN functions (Spark)
├── firebase.blaze.json      # CON functions (backup para futuro)
├── firestore.rules          # Seguridad
└── firestore.indexes.json   # Índices
\`\`\`

---

## 🚀 Comandos para Desplegar (Plan Spark)

\`\`\`bash
# 1. Construir la aplicación Next.js
npm run build

# 2. Desplegar SOLO hosting y firestore
firebase deploy --only hosting,firestore

# 3. Ver tu sitio
firebase open hosting:site
\`\`\`

### Si quieres desplegar solo hosting (sin tocar reglas):
\`\`\`bash
firebase deploy --only hosting
\`\`\`

### Si quieres actualizar solo las reglas de Firestore:
\`\`\`bash
firebase deploy --only firestore:rules
\`\`\`

---

## 📊 Monitoreo y Límites

### Ver tu uso actual:
\`\`\`bash
firebase projects:list
firebase projects:get innovationplatforms
\`\`\`

### En Firebase Console:
1. Ve a https://console.firebase.google.com/project/innovationplatforms/usage
2. Revisa:
   - **Hosting**: Almacenamiento y transferencia
   - **Firestore**: Lecturas, escrituras, eliminaciones
   - **Authentication**: Usuarios activos

### Límites Plan Spark:
- Hosting: 10 GB almacenamiento, 360 MB/día transferencia
- Firestore: 1 GB almacenamiento, 50K lecturas/día, 20K escrituras/día
- Authentication: Ilimitado

---

## 🎯 Implementación Paso a Paso

### Fase 1: Desplegar sin Functions ✅

\`\`\`bash
# 1. Usar firebase.spark.json
cp firebase.spark.json firebase.json

# 2. Build
npm run build

# 3. Deploy
firebase deploy --only hosting,firestore
\`\`\`

### Fase 2: Mover lógica al frontend

Crea estos archivos:

\`\`\`bash
# Crear carpeta services si no existe
mkdir -p services

# Crear servicios
touch services/metricsService.ts
touch services/paperSearchService.ts
touch services/translationService.ts
\`\`\`

### Fase 3: Actualizar componentes

Reemplaza las llamadas a Cloud Functions por los nuevos servicios.

---

## 🔮 Futuro: Cuándo considerar Plan Blaze

Considera upgradar a Blaze si:
- ❌ Necesitas procesar más de 50K lecturas/día en Firestore
- ❌ Necesitas lógica backend compleja (procesamiento de imágenes, emails, etc)
- ❌ Necesitas integraciones con servicios que requieren autenticación de servidor
- ❌ Necesitas scheduled functions (tareas programadas)

**Pero NO lo necesitas para:**
- ✅ Autenticación de usuarios
- ✅ CRUD básico de datos
- ✅ Hosting de sitio estático
- ✅ Búsqueda de papers en APIs públicas
- ✅ La mayoría de aplicaciones web estándar

---

## 💡 Resumen

| Funcionalidad | Con Functions (Blaze) | Sin Functions (Spark) |
|---------------|----------------------|----------------------|
| **Hosting** | ✅ | ✅ |
| **Firestore** | ✅ | ✅ |
| **Auth** | ✅ | ✅ |
| **Métricas** | Cloud Function | Frontend + Firestore |
| **Búsqueda Papers** | Cloud Function | APIs directas |
| **Traducción** | Cloud Function | APIs públicas o estático |
| **Costo** | Desde $0.40/mes | $0/mes |

---

## 📞 ¿Necesitas Ayuda?

Si tienes dudas sobre cómo implementar alguna de estas alternativas, avísame y te ayudo con el código específico.

## ✨ Siguiente Paso

Una vez que leas esta guía, puedo ayudarte a:
1. Crear los archivos de servicios (metricsService, etc)
2. Actualizar los componentes que usaban Functions
3. Configurar emuladores para desarrollo local
4. Optimizar Firestore rules para máxima seguridad

¡Tu aplicación funcionará perfectamente en el plan gratuito! 🚀

