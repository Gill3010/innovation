# 🔥 Guía de Configuración de Firebase

## 📋 Resumen
Tu aplicación **YA tiene Firebase integrado** y listo para funcionar. Solo necesitas configurar las credenciales.

## ✅ ¿Qué Ya Está Configurado?

### 1. **Autenticación de Usuarios** ✓
- Login con email y contraseña
- Registro de nuevos usuarios
- Cierre de sesión
- Recuperación de contraseña

### 2. **Base de Datos Firestore** ✓
- Colección `users` para datos de usuarios
- Colecciones para papers, proyectos y biblioteca
- Reglas de seguridad implementadas

### 3. **Almacenamiento** ✓
- Firebase Storage configurado para archivos

---

## 🚀 Pasos para Activar Firebase

### Paso 1: Acceder a Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Si no tienes proyecto, créalo con el nombre: **innovationplatforms**
3. Si ya lo tienes, selecciónalo

### Paso 2: Obtener Credenciales

#### En Firebase Console:
1. Click en el ícono de configuración (⚙️) → **Configuración del proyecto**
2. Desplázate hasta **Tus apps**
3. Si no hay app web, click en **</>** (Web) para agregar una
4. Copia los valores de configuración

#### Ejemplo de lo que verás:
\`\`\`javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxx...",
  authDomain: "innovationplatforms.firebaseapp.com",
  projectId: "innovationplatforms",
  storageBucket: "innovationplatforms.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
\`\`\`

### Paso 3: Actualizar .env.local

Abre el archivo `.env.local` en la raíz del proyecto y reemplaza los valores:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBxxx...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=innovationplatforms.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=innovationplatforms
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=innovationplatforms.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
\`\`\`

### Paso 4: Habilitar Autenticación

#### En Firebase Console:
1. Click en **Authentication** en el menú lateral
2. Click en **Get Started** (si es primera vez)
3. En la pestaña **Sign-in method**
4. Click en **Email/Password**
5. **Habilítalo** y guarda

### Paso 5: Configurar Firestore Database

#### En Firebase Console:
1. Click en **Firestore Database** en el menú lateral
2. Click en **Create database**
3. Selecciona **Start in production mode**
4. Elige la ubicación más cercana (ejemplo: `us-east1`)
5. Click **Enable**

#### Desplegar Reglas de Seguridad:
\`\`\`bash
# En la terminal del proyecto:
firebase deploy --only firestore:rules
\`\`\`

Las reglas ya están en el archivo `firestore.rules` y protegen:
- ✓ Usuarios solo pueden ver/editar sus propios datos
- ✓ Solo propietarios y colaboradores acceden a proyectos
- ✓ Biblioteca personal es privada para cada usuario

### Paso 6: Reiniciar el Servidor

\`\`\`bash
# Detén el servidor (Ctrl+C)
# Reinicia para cargar las nuevas variables de entorno
npm run dev
\`\`\`

---

## 🧪 Probar la Configuración

### 1. Registro de Usuario
\`\`\`
1. Ve a http://localhost:3000/register
2. Completa el formulario
3. Click en "Create Account"
4. Si todo está bien, serás redirigido al Dashboard
\`\`\`

### 2. Verificar en Firebase Console
\`\`\`
1. Ve a Authentication → Users
   ➜ Deberías ver tu usuario nuevo

2. Ve a Firestore Database → users
   ➜ Deberías ver un documento con tu información
\`\`\`

### 3. Iniciar Sesión
\`\`\`
1. Cierra sesión
2. Ve a http://localhost:3000/login
3. Usa las mismas credenciales
4. Deberías poder acceder
\`\`\`

---

## 📊 Estructura de Datos en Firestore

### Colección: `users`
\`\`\`javascript
{
  id: "uid_generado_por_firebase",
  email: "usuario@ejemplo.com",
  name: "Juan Pérez",
  affiliation: "Universidad de Panamá",
  orcidId: "0000-0001-2345-6789",
  googleScholarId: "abc123xyz",
  researchInterests: ["Inteligencia Artificial", "Machine Learning"],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
\`\`\`

### Colección: `papers`
\`\`\`javascript
{
  id: "paper_id",
  title: "Título del Paper",
  authors: ["Autor 1", "Autor 2"],
  abstract: "Resumen...",
  journal: "Nature",
  publicationDate: Timestamp,
  doi: "10.1038/nature12373",
  tags: ["AI", "ML"],
  ownerId: "uid_del_usuario",
  collaborators: ["uid1", "uid2"]
}
\`\`\`

### Colección: `research_projects`
\`\`\`javascript
{
  id: "project_id",
  title: "Nombre del Proyecto",
  description: "Descripción...",
  ownerId: "uid_del_usuario",
  collaborators: ["uid1", "uid2"],
  papers: ["paper_id1", "paper_id2"],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
\`\`\`

---

## 🔒 Seguridad

### Reglas de Firestore (Ya Implementadas)

✅ **Usuarios**: Solo pueden leer/escribir sus propios datos
✅ **Proyectos**: Solo propietario y colaboradores tienen acceso
✅ **Papers**: Solo propietario y colaboradores tienen acceso
✅ **Biblioteca Personal**: Cada usuario solo ve sus papers

### Ejemplo de Regla:
\`\`\`javascript
match /users/{userId} {
  // Solo el usuario puede ver y editar su propio documento
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
\`\`\`

---

## 🐛 Troubleshooting

### Error: "Firebase config is not defined"
**Solución**: Verifica que el archivo `.env.local` esté en la raíz del proyecto y reinicia el servidor.

### Error: "Missing or insufficient permissions"
**Solución**: Despliega las reglas de Firestore:
\`\`\`bash
firebase deploy --only firestore:rules
\`\`\`

### Error: "auth/operation-not-allowed"
**Solución**: Habilita Email/Password en Firebase Console → Authentication → Sign-in method

### Usuario no se guarda en Firestore
**Solución**: Verifica que Firestore Database esté creado y las reglas estén desplegadas.

---

## 📱 Próximos Pasos Opcionales

### 1. Autenticación Social
- Google Sign-In
- GitHub Sign-In
- Apple Sign-In

### 2. APIs Científicas
Puedes agregar APIs para buscar papers:
- CrossRef API (gratuita)
- PubMed API (gratuita)
- Semantic Scholar API (gratuita)

### 3. Funciones en la Nube
Automatizar tareas como:
- Enviar emails de bienvenida
- Generar reportes
- Sincronizar datos

---

## 📞 Necesitas Ayuda?

Si tienes problemas:
1. Revisa la consola del navegador (F12) para errores
2. Revisa la terminal donde corre Next.js
3. Verifica Firebase Console para ver si los datos llegan

## ✨ Comandos Útiles

\`\`\`bash
# Ver logs en tiempo real de Firebase
firebase functions:log --follow

# Desplegar todo
firebase deploy

# Solo reglas de Firestore
firebase deploy --only firestore:rules

# Solo Cloud Functions
firebase deploy --only functions
\`\`\`

