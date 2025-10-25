# 🚀 Comandos de Despliegue - Firebase

## 📋 Configuraciones Disponibles

Tu proyecto tiene dos configuraciones de Firebase:

1. **`firebase.spark.json`** - Plan GRATUITO (Sin Cloud Functions) ✅
2. **`firebase.blaze.json`** - Plan PAGO (Con Cloud Functions) 💳

---

## ✅ Desplegar en Plan Spark (Gratuito)

### Paso 1: Activar configuración Spark

\`\`\`bash
# Backup del firebase.json actual (si existe)
cp firebase.json firebase.backup.json

# Usar configuración Spark (sin functions)
cp firebase.spark.json firebase.json
\`\`\`

### Paso 2: Construir la aplicación

\`\`\`bash
npm run build
\`\`\`

### Paso 3: Desplegar

\`\`\`bash
# Desplegar SOLO hosting y firestore (sin functions)
firebase deploy --only hosting,firestore
\`\`\`

**Resultado esperado:**
\`\`\`
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/innovationplatforms/overview
Hosting URL: https://innovationplatforms.web.app
\`\`\`

---

## 💳 Desplegar en Plan Blaze (Con Functions)

⚠️ **Requiere:**
- Cuenta de facturación configurada
- Plan Blaze activo
- Presupuesto recomendado: ~$1-5/mes

### Paso 1: Activar configuración Blaze

\`\`\`bash
# Usar configuración original (con functions)
cp firebase.blaze.json firebase.json
\`\`\`

### Paso 2: Construir aplicación y funciones

\`\`\`bash
# Construir Next.js
npm run build

# Construir functions
cd functions
npm run build
cd ..
\`\`\`

### Paso 3: Desplegar todo

\`\`\`bash
firebase deploy
\`\`\`

---

## 🎯 Comandos Útiles

### Desplegar solo Hosting (más rápido)
\`\`\`bash
npm run build
firebase deploy --only hosting
\`\`\`

### Desplegar solo Reglas de Firestore
\`\`\`bash
firebase deploy --only firestore:rules
\`\`\`

### Desplegar solo Índices de Firestore
\`\`\`bash
firebase deploy --only firestore:indexes
\`\`\`

### Ver el sitio en vivo
\`\`\`bash
firebase open hosting:site
\`\`\`

### Ver logs de despliegue
\`\`\`bash
firebase deploy --debug
\`\`\`

---

## 🧪 Desarrollo Local

### Con Emuladores (Recomendado)
\`\`\`bash
# Terminal 1: Emuladores de Firebase
firebase emulators:start

# Terminal 2: Next.js dev server
npm run dev
\`\`\`

Acceder a:
- App: http://localhost:3000
- Emulator UI: http://localhost:4000
- Firestore Emulator: http://localhost:8080
- Auth Emulator: http://localhost:9099

### Sin Emuladores
\`\`\`bash
npm run dev
\`\`\`

---

## 📊 Monitoreo

### Ver uso actual
\`\`\`bash
# En la terminal
firebase projects:get innovationplatforms

# En el navegador
firebase open usage
\`\`\`

### Ver logs de hosting
\`\`\`bash
firebase hosting:channel:list
\`\`\`

---

## 🔄 Workflow Recomendado

### Para Plan Spark (Gratuito):

\`\`\`bash
# 1. Desarrollo local
npm run dev

# 2. Construir
npm run build

# 3. Cambiar a config Spark
cp firebase.spark.json firebase.json

# 4. Desplegar
firebase deploy --only hosting,firestore
\`\`\`

### Script automatizado:

Crea un archivo \`deploy-spark.sh\`:

\`\`\`bash
#!/bin/bash

echo "🔨 Building Next.js app..."
npm run build

echo "⚙️  Switching to Spark config..."
cp firebase.spark.json firebase.json

echo "🚀 Deploying to Firebase..."
firebase deploy --only hosting,firestore

echo "✅ Deploy complete!"
\`\`\`

Dar permisos y ejecutar:
\`\`\`bash
chmod +x deploy-spark.sh
./deploy-spark.sh
\`\`\`

---

## ❌ Solución de Problemas

### Error: "Missing or insufficient permissions"
**Solución:**
\`\`\`bash
firebase login --reauth
firebase deploy --only hosting,firestore
\`\`\`

### Error: "Required API can't be enabled"
**Causa:** Estás intentando desplegar functions sin plan Blaze

**Solución:**
\`\`\`bash
# Usar solo hosting y firestore
firebase deploy --only hosting,firestore
\`\`\`

### Error: "Build failed"
**Solución:**
\`\`\`bash
# Limpiar cache
rm -rf .next out node_modules
npm install
npm run build
\`\`\`

### Error: "Authentication error"
**Solución:**
\`\`\`bash
firebase logout
firebase login
firebase use innovationplatforms
\`\`\`

---

## 📝 Notas Importantes

1. ✅ **Plan Spark:** \`firebase deploy --only hosting,firestore\`
2. ❌ **Plan Spark:** NO usar \`firebase deploy\` (intenta desplegar functions)
3. 💡 **Tip:** Siempre verificar qué archivo \`firebase.json\` estás usando
4. 🔒 **Seguridad:** Las reglas de Firestore se despliegan automáticamente
5. 📈 **Monitoreo:** Revisa Firebase Console regularmente

---

## 🎓 Comandos de Aprendizaje

\`\`\`bash
# Ver configuración actual
firebase list

# Ver proyecto activo
firebase use

# Ver información del proyecto
firebase projects:get innovationplatforms

# Ver historial de despliegues
firebase hosting:channel:list

# Crear un canal de preview
firebase hosting:channel:deploy preview-feature-x
\`\`\`

---

## 🚀 ¡Listo para Desplegar!

Ejecuta estos comandos para tu primer despliegue:

\`\`\`bash
# 1. Construir
npm run build

# 2. Usar config Spark
cp firebase.spark.json firebase.json

# 3. Desplegar
firebase deploy --only hosting,firestore

# 4. Ver resultado
firebase open hosting:site
\`\`\`

🎉 ¡Tu aplicación estará en vivo en segundos!

