# Guía de Migración: Innovation Platforms → InnovaProyectos

**Fecha:** 26 de octubre de 2025  
**Proyecto origen:** `innovationplatforms`  
**Proyecto destino:** `innovaproyectos` (nuevo)

---

## FASE 1: PREPARACIÓN PRE-MIGRACIÓN

### ✅ Checklist Pre-Migración

- [ ] **Backup completo de datos actuales**
  - Exportar Firestore completo
  - Descargar reglas de seguridad actuales
  - Exportar usuarios de Authentication
  - Backup de Storage (si aplica)
  - Guardar configuración actual de Cloud Functions

- [ ] **Documentación revisada**
  - Leer `ANALISIS_PROYECTO_ACTUAL.md` completamente
  - Verificar todas las dependencias del proyecto
  - Revisar variables de entorno necesarias

- [ ] **Verificar acceso a Firebase Console**
  - Confirmar permisos de Owner en Firebase
  - Confirmar permisos para crear proyectos nuevos
  - Verificar plan de facturación (Spark vs Blaze)

- [ ] **Ambiente de desarrollo listo**
  - Firebase CLI instalado y actualizado (`npm install -g firebase-tools`)
  - Node.js 18 o superior instalado
  - Git configurado correctamente
  - Backup del proyecto local realizado

---

## FASE 2: CREACIÓN DEL NUEVO PROYECTO FIREBASE

### Paso 1: Crear Proyecto en Firebase Console

1. **Ir a Firebase Console**
   ```
   https://console.firebase.google.com/
   ```

2. **Crear nuevo proyecto**
   - Click en "Agregar proyecto" / "Add project"
   - Nombre del proyecto: **InnovaProyectos**
   - ID del proyecto: `innovaproyectos` (verificar disponibilidad)
   - Google Analytics: Opcional (recomendado: No por ahora)

3. **Confirmar creación**
   - Esperar a que se complete el aprovisionamiento (1-2 minutos)

### Paso 2: Configurar Plan de Firebase

**Opción A: Plan Spark (Gratuito)**
- Limitaciones: 
  - 50,000 lecturas/día en Firestore
  - 20,000 escrituras/día
  - 1GB almacenamiento
  - Cloud Functions limitadas

**Opción B: Plan Blaze (Pay-as-you-go)**
- Recomendado si el proyecto actual usa Blaze
- Sin limitaciones estrictas
- Pago según uso real

**Acción requerida:**
```bash
# Verificar plan del proyecto actual
firebase projects:list

# Configurar plan en nuevo proyecto (desde Firebase Console)
# Settings → Usage and billing → Modify plan
```

---

## FASE 3: MIGRACIÓN DE FIREBASE AUTHENTICATION

### Paso 1: Habilitar Proveedores de Autenticación

1. **En Firebase Console del nuevo proyecto:**
   - Authentication → Sign-in method
   - Habilitar: **Email/Password**
   - Configurar dominio autorizado: `innovaproyectos.web.app` y tu dominio personalizado

### Paso 2: Exportar Usuarios del Proyecto Actual

```bash
# Autenticarse en Firebase CLI
firebase login

# Seleccionar proyecto actual
firebase use innovationplatforms

# Exportar usuarios (requiere plan Blaze en proyecto origen)
firebase auth:export users-export.json --format=JSON
```

### Paso 3: Importar Usuarios al Nuevo Proyecto

```bash
# Cambiar a nuevo proyecto
firebase use innovaproyectos

# Importar usuarios
firebase auth:import users-export.json --hash-algo=scrypt

# NOTA: Las contraseñas se importan con hash, los usuarios podrán 
# iniciar sesión con las mismas credenciales
```

**IMPORTANTE:** Si no tienes plan Blaze en el proyecto actual, los usuarios deberán:
- Registrarse nuevamente, O
- Usar función "Olvidé mi contraseña" con sus emails

---

## FASE 4: MIGRACIÓN DE FIRESTORE

### Paso 1: Habilitar Firestore en Nuevo Proyecto

1. **Firebase Console → Firestore Database**
2. Click en "Crear base de datos"
3. Modo: **Producción** (con reglas de seguridad)
4. Ubicación: **us-central** (o la misma que el proyecto actual)
   - ⚠️ **MUY IMPORTANTE:** La ubicación NO se puede cambiar después

### Paso 2: Configurar Reglas de Seguridad

```bash
# En tu proyecto local
cd /Users/israelsamuels/innovation

# Cambiar a nuevo proyecto
firebase use innovaproyectos

# Desplegar reglas de seguridad (sin datos aún)
firebase deploy --only firestore:rules
```

**Verificar en Firebase Console:**
- Firestore → Reglas
- Las reglas deben ser idénticas al proyecto actual

### Paso 3: Configurar Índices Compuestos

```bash
# Desplegar índices
firebase deploy --only firestore:indexes

# Esperar a que se creen (puede tomar varios minutos)
# Verificar en Firebase Console → Firestore → Índices
```

### Paso 4: Exportar Datos de Firestore (Proyecto Actual)

**Opción A: Usar Firebase CLI (Requiere Blaze + gsutil)**

```bash
# Instalar Google Cloud SDK si no lo tienes
# https://cloud.google.com/sdk/docs/install

# Autenticarse
gcloud auth login

# Exportar Firestore completo
gcloud firestore export gs://innovationplatforms.appspot.com/firestore-backup

# Esperar a que complete (puede tomar tiempo según tamaño de datos)
```

**Opción B: Usar Script de Node.js (Recomendado para datos pequeños)**

Crear archivo `scripts/export-firestore.js`:

```javascript
const admin = require('firebase-admin');
const fs = require('fs');

// Inicializar con proyecto actual
const serviceAccount = require('./innovationplatforms-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function exportCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  const data = [];
  
  snapshot.forEach(doc => {
    data.push({
      id: doc.id,
      data: doc.data()
    });
  });
  
  fs.writeFileSync(
    `backup/${collectionName}.json`, 
    JSON.stringify(data, null, 2)
  );
  
  console.log(`✅ Exported ${collectionName}: ${data.length} documents`);
}

async function exportAllData() {
  const collections = [
    'users',
    'research_projects',
    'papers',
    'collaborations',
    'analytics'
  ];
  
  // Crear directorio backup
  if (!fs.existsSync('backup')) {
    fs.mkdirSync('backup');
  }
  
  for (const collection of collections) {
    await exportCollection(collection);
  }
  
  console.log('✅ Exportación completa');
}

exportAllData().catch(console.error);
```

**Ejecutar script:**

```bash
# Descargar service account key del proyecto actual
# Firebase Console → Project Settings → Service Accounts → Generate new private key

# Instalar dependencias
npm install firebase-admin

# Ejecutar export
node scripts/export-firestore.js
```

### Paso 5: Importar Datos a Nuevo Proyecto

**Usando gsutil (si usaste Opción A):**

```bash
# Importar desde Cloud Storage
gcloud firestore import gs://innovationplatforms.appspot.com/firestore-backup \
  --project=innovaproyectos
```

**Usando script de Node.js (si usaste Opción B):**

Crear archivo `scripts/import-firestore.js`:

```javascript
const admin = require('firebase-admin');
const fs = require('fs');

// Inicializar con NUEVO proyecto
const serviceAccount = require('./innovaproyectos-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function importCollection(collectionName) {
  const data = JSON.parse(
    fs.readFileSync(`backup/${collectionName}.json`, 'utf8')
  );
  
  const batch = db.batch();
  let count = 0;
  
  for (const item of data) {
    const docRef = db.collection(collectionName).doc(item.id);
    batch.set(docRef, item.data);
    count++;
    
    // Firestore batch limit: 500 operaciones
    if (count % 500 === 0) {
      await batch.commit();
      console.log(`  Committed ${count} documents...`);
    }
  }
  
  // Commit final
  if (count % 500 !== 0) {
    await batch.commit();
  }
  
  console.log(`✅ Imported ${collectionName}: ${count} documents`);
}

async function importAllData() {
  const collections = [
    'users',
    'research_projects',
    'papers',
    'collaborations',
    'analytics'
  ];
  
  for (const collection of collections) {
    if (fs.existsSync(`backup/${collection}.json`)) {
      await importCollection(collection);
    } else {
      console.log(`⚠️  Skipping ${collection} (file not found)`);
    }
  }
  
  console.log('✅ Importación completa');
}

importAllData().catch(console.error);
```

**Ejecutar import:**

```bash
# Descargar service account key del NUEVO proyecto

# Ejecutar import
node scripts/import-firestore.js
```

### Paso 6: Verificar Datos Importados

```bash
# Verificar en Firebase Console
# Firestore → Data
# Confirmar que todas las colecciones existen con datos
```

---

## FASE 5: MIGRACIÓN DE CLOUD STORAGE

### Paso 1: Habilitar Storage en Nuevo Proyecto

1. **Firebase Console → Storage**
2. Click en "Comenzar" / "Get started"
3. Modo: **Producción** (con reglas de seguridad)
4. Ubicación: **us-central** (la misma que Firestore)

### Paso 2: Configurar Reglas de Seguridad de Storage

Crear archivo `storage.rules`:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Archivos de usuario (PDFs, avatares, etc.)
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // PDFs de papers
    match /papers/{paperId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Archivos públicos
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Actualizar `firebase.json`:**

```json
{
  "hosting": { ... },
  "firestore": { ... },
  "storage": {
    "rules": "storage.rules"
  }
}
```

**Desplegar reglas:**

```bash
firebase deploy --only storage:rules
```

### Paso 3: Copiar Archivos de Storage (Si aplica)

**Usando gsutil:**

```bash
# Copiar todos los archivos
gsutil -m cp -r \
  gs://innovationplatforms.appspot.com/* \
  gs://innovaproyectos.appspot.com/

# Verificar
gsutil ls gs://innovaproyectos.appspot.com/
```

**NOTA:** Si no hay archivos en Storage actualmente, omitir este paso.

---

## FASE 6: MIGRACIÓN DE CLOUD FUNCTIONS

### Paso 1: Verificar Node.js y Dependencias

```bash
# Verificar versión de Node.js
node --version
# Debe ser v18 o superior

# En el directorio functions/
cd functions
npm install
```

### Paso 2: Actualizar Configuración de Firebase CLI

```bash
# Desde la raíz del proyecto
firebase use innovaproyectos

# Verificar que esté seleccionado
firebase projects:list
```

### Paso 3: Desplegar Cloud Functions

```bash
# Compilar funciones
cd functions
npm run build

# Regresar a raíz
cd ..

# Desplegar SOLO functions
firebase deploy --only functions

# Esperar a que se desplieguen todas (puede tomar varios minutos)
```

### Paso 4: Verificar Funciones Desplegadas

```bash
# Listar funciones
firebase functions:list

# Deberías ver:
# - helloWorld
# - getResearchMetrics
# - searchExternalPapers
# - translateText
```

**Probar funciones:**

```bash
# Obtener URL de función
firebase functions:config:get

# Probar helloWorld
curl https://us-central1-innovaproyectos.cloudfunctions.net/helloWorld
```

### Paso 5: Configurar Variables de Entorno (Si aplica)

```bash
# Si tuvieras variables de entorno en functions
firebase functions:config:set someservice.key="THE API KEY"

# Redesplegar
firebase deploy --only functions
```

**NOTA:** El proyecto actual no usa variables de entorno en functions.

---

## FASE 7: MIGRACIÓN DE FIREBASE HOSTING

### Paso 1: Compilar Aplicación Next.js

```bash
# Desde la raíz del proyecto
npm run build

# Esto genera el directorio /out con archivos estáticos
```

### Paso 2: Actualizar .firebaserc

```bash
# Editar .firebaserc para apuntar al nuevo proyecto
```

El archivo debe quedar así:

```json
{
  "projects": {
    "default": "innovaproyectos"
  }
}
```

### Paso 3: Verificar firebase.json

El archivo `firebase.json` ya debe estar correcto con la configuración de hosting:

```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [ ... ],
    "cleanUrls": true,
    "trailingSlash": false
  },
  ...
}
```

### Paso 4: Desplegar Hosting

```bash
# Desplegar solo hosting
firebase deploy --only hosting

# Esperar confirmación
# ✔  Deploy complete!
# Hosting URL: https://innovaproyectos.web.app
```

### Paso 5: Verificar Despliegue

1. **Abrir en navegador:**
   ```
   https://innovaproyectos.web.app
   ```

2. **Probar funcionalidades clave:**
   - Página de inicio carga correctamente
   - Login/Register funcionan
   - Dashboard muestra datos
   - Formularios responden

---

## FASE 8: CONFIGURACIÓN DEL CLIENTE

### Paso 1: Obtener Credenciales del Nuevo Proyecto

1. **Firebase Console → Project Settings**
2. Click en "Agregar app" → Web (</>) 
3. Nombre: "InnovaProyectos Web App"
4. Firebase Hosting: Seleccionado
5. Copiar todas las credenciales

### Paso 2: Actualizar Variables de Entorno

Crear/actualizar `.env.local`:

```env
# Firebase Configuration - NUEVO PROYECTO
NEXT_PUBLIC_FIREBASE_API_KEY=<nuevo_api_key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=innovaproyectos.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=innovaproyectos
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=innovaproyectos.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<nuevo_sender_id>
NEXT_PUBLIC_FIREBASE_APP_ID=<nuevo_app_id>

# Scientific APIs (mantener los mismos)
CROSSREF_API_KEY=your_crossref_key_here
PUBMED_API_KEY=your_pubmed_key_here
OPENAI_API_KEY=your_openai_key_here

# OJS Integration (mantener los mismos)
NEXT_PUBLIC_OJS_BASE_URL=https://relaticpanama.org/_journals
NEXT_PUBLIC_OJS_API_KEY=your_NEW_ojs_api_key
NEXT_PUBLIC_OJS_API_SECRET=your_NEW_ojs_api_secret
```

### Paso 3: Reconstruir y Redesplegar

```bash
# Limpiar build anterior
rm -rf .next out

# Reconstruir con nuevas variables
npm run build

# Redesplegar
firebase deploy --only hosting
```

---

## FASE 9: CONFIGURACIÓN DE DOMINIO PERSONALIZADO

### Paso 1: Agregar Dominio Personalizado

1. **Firebase Console → Hosting**
2. Click en "Agregar dominio personalizado"
3. Ingresar tu dominio (ej: `innovaproyectos.com`)
4. Seguir instrucciones para verificación de propiedad
5. Configurar registros DNS según indicaciones de Firebase

### Paso 2: Esperar Propagación DNS

- Puede tomar de 24 a 48 horas
- Verificar con: `nslookup tu-dominio.com`

### Paso 3: Configurar SSL

- Firebase provisiona certificado SSL automáticamente
- Una vez que DNS propague, el certificado se activa automáticamente
- Verificar: `https://tu-dominio.com`

---

## FASE 10: VERIFICACIÓN POST-MIGRACIÓN

### Checklist de Verificación Completa

#### **Authentication** ✅
- [ ] Usuarios pueden iniciar sesión
- [ ] Registro de nuevos usuarios funciona
- [ ] Recuperación de contraseña funciona
- [ ] Cierre de sesión funciona
- [ ] Profile actualización funciona

#### **Firestore** ✅
- [ ] Todas las colecciones existen con datos
- [ ] Lectura de papers funciona
- [ ] Creación de nuevo paper funciona
- [ ] Actualización de paper funciona
- [ ] Eliminación de paper funciona
- [ ] Búsqueda y filtrado funcionan
- [ ] Dashboard muestra estadísticas correctas

#### **Storage** ✅
- [ ] Archivos existentes son accesibles
- [ ] Subida de nuevos archivos funciona
- [ ] Descarga de archivos funciona
- [ ] Eliminación de archivos funciona

#### **Cloud Functions** ✅
- [ ] helloWorld responde correctamente
- [ ] getResearchMetrics devuelve datos
- [ ] translateText funciona (probar traducción)
- [ ] searchExternalPapers responde

#### **Hosting** ✅
- [ ] Todas las rutas cargan correctamente
- [ ] Imágenes y assets se muestran
- [ ] Rewrites funcionan (URLs limpias)
- [ ] Responsive funciona en móvil
- [ ] Formularios envían datos
- [ ] Animaciones funcionan

#### **Integraciones** ✅
- [ ] CrossRef API funciona (buscar por DOI)
- [ ] OJS integration configurada (si aplica)
- [ ] Traducción multiidioma funciona

---

## FASE 11: LIMPIEZA Y DOCUMENTACIÓN

### Paso 1: Actualizar Documentación

```bash
# Actualizar README.md con nuevo proyecto
# Actualizar FIREBASE_SETUP.md
# Actualizar DEPLOYMENT_INSTRUCTIONS.md
```

### Paso 2: Limpiar Archivos de Backup

```bash
# Mover backups a ubicación segura
mkdir -p ~/firebase-backups/innovation-platforms-migration-2025
mv backup/* ~/firebase-backups/innovation-platforms-migration-2025/
mv users-export.json ~/firebase-backups/innovation-platforms-migration-2025/

# Limpiar archivos temporales
rm -rf backup/
```

### Paso 3: Actualizar Control de Versiones

```bash
# Commit de cambios de configuración
git add .firebaserc .env.local
git commit -m "chore: migrate to InnovaProyectos Firebase project"

# Tag de la migración
git tag -a v1.0-innovaproyectos -m "Migration to InnovaProyectos project"
git push origin main --tags
```

### Paso 4: Documentar Migración

Crear archivo `MIGRATION_LOG.md`:

```markdown
# Log de Migración a InnovaProyectos

**Fecha:** [FECHA]
**Ejecutado por:** [TU NOMBRE]
**Duración:** [TIEMPO TOTAL]

## Resumen
- Proyecto origen: innovationplatforms
- Proyecto destino: innovaproyectos
- Datos migrados: [X usuarios, Y papers, Z proyectos]

## Verificaciones Post-Migración
- ✅ Authentication
- ✅ Firestore
- ✅ Storage
- ✅ Cloud Functions
- ✅ Hosting

## Issues Encontrados
[Listar cualquier problema encontrado y su solución]

## Notas Adicionales
[Cualquier observación importante]
```

---

## FASE 12: MONITOREO POST-MIGRACIÓN

### Primeras 24 Horas

**Monitorear en Firebase Console:**

1. **Authentication**
   - Verificar inicios de sesión exitosos
   - Revisar errores de autenticación

2. **Firestore**
   - Verificar lecturas/escrituras
   - Revisar uso de cuota
   - Verificar latencia de queries

3. **Cloud Functions**
   - Verificar invocaciones
   - Revisar logs de errores
   - Verificar tiempos de ejecución

4. **Hosting**
   - Verificar tráfico
   - Revisar errores 404
   - Verificar CDN

### Primera Semana

- Revisar métricas diarias
- Recopilar feedback de usuarios
- Ajustar recursos según sea necesario
- Optimizar queries si hay problemas de rendimiento

---

## FASE 13: DESACTIVACIÓN DEL PROYECTO ANTERIOR (OPCIONAL)

⚠️ **PRECAUCIÓN:** Solo realizar después de confirmar que todo funciona correctamente en el nuevo proyecto.

### Opción A: Mantener Proyecto Anterior (Recomendado por 30 días)

- Mantener proyecto actual como backup
- No eliminar datos
- Desactivar solo hosting para evitar confusión

```bash
# Deshabilitar hosting del proyecto anterior
firebase use innovationplatforms
firebase hosting:disable
```

### Opción B: Eliminar Proyecto Anterior (Después de 30+ días)

**Solo si estás 100% seguro de que todo funciona en el nuevo proyecto:**

1. Exportar backup final
2. Firebase Console → Project Settings
3. Scroll down → "Eliminar proyecto"
4. Confirmar eliminación

---

## SCRIPTS DE VERIFICACIÓN

### Script de Verificación Rápida

Crear `scripts/verify-migration.js`:

```javascript
const admin = require('firebase-admin');

const serviceAccount = require('./innovaproyectos-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function verifyMigration() {
  console.log('🔍 Verificando migración...\n');
  
  // Verificar colecciones
  const collections = ['users', 'papers', 'research_projects', 'collaborations'];
  
  for (const coll of collections) {
    const snapshot = await db.collection(coll).limit(1).get();
    if (snapshot.empty) {
      console.log(`❌ ${coll}: Sin datos`);
    } else {
      const count = await db.collection(coll).count().get();
      console.log(`✅ ${coll}: ${count.data().count} documentos`);
    }
  }
  
  console.log('\n✅ Verificación completa');
}

verifyMigration().catch(console.error);
```

---

## SOLUCIÓN DE PROBLEMAS COMUNES

### Problema: "Permission denied" en Firestore

**Solución:**
```bash
# Verificar que las reglas se desplegaron
firebase deploy --only firestore:rules

# Verificar en Firebase Console que las reglas son correctas
```

### Problema: Cloud Functions no responden

**Solución:**
```bash
# Ver logs de la función
firebase functions:log --only <function-name>

# Redesplegar función específica
firebase deploy --only functions:<function-name>
```

### Problema: Assets no cargan en Hosting

**Solución:**
```bash
# Limpiar caché y reconstruir
rm -rf .next out
npm run build
firebase deploy --only hosting
```

### Problema: Variables de entorno no funcionan

**Solución:**
```bash
# Verificar que .env.local existe
cat .env.local

# Reconstruir con nuevas variables
rm -rf .next out
npm run build
```

---

## CONTACTO Y SOPORTE

### Recursos Útiles
- **Firebase Documentation:** https://firebase.google.com/docs
- **Firebase Support:** https://firebase.google.com/support
- **Next.js Documentation:** https://nextjs.org/docs
- **Stack Overflow:** Tag [firebase] y [next.js]

### Comandos de Ayuda
```bash
# Ayuda general de Firebase CLI
firebase --help

# Ayuda específica de comandos
firebase deploy --help
firebase functions:log --help
```

---

## RESUMEN EJECUTIVO

### Tiempo Estimado Total: 4-8 horas

**Desglose por fase:**
- Preparación: 30 min
- Creación proyecto: 15 min
- Migración Auth: 30 min
- Migración Firestore: 1-2 horas (depende de datos)
- Migración Storage: 30 min
- Migración Functions: 30 min
- Migración Hosting: 30 min
- Configuración cliente: 30 min
- Verificación: 1 hora
- Documentación: 30 min

### Costos Estimados

**Plan Spark (Gratuito):**
- Adecuado si el uso actual está dentro de límites
- $0/mes

**Plan Blaze (Pay-as-you-go):**
- Funciones: ~$0.40/millón de invocaciones
- Firestore: ~$0.06/100K lecturas
- Hosting: ~$0.15/GB
- Estimado mensual: $5-$20 (depende de tráfico)

### Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Pérdida de datos | Baja | Alto | Múltiples backups antes de migrar |
| Downtime prolongado | Media | Medio | Mantener proyecto anterior activo |
| Configuración incorrecta | Media | Medio | Verificación exhaustiva post-migración |
| Problemas de autenticación | Baja | Alto | Importar usuarios con hashes |
| Costos inesperados | Baja | Bajo | Monitorear uso diario |

---

**Fin de la Guía de Migración**

Para cualquier duda o problema durante la migración, consultar:
1. Esta guía completa
2. `ANALISIS_PROYECTO_ACTUAL.md`
3. Documentación oficial de Firebase
4. Logs de Firebase Console



