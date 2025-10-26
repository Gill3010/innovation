# Scripts de Migración - InnovaProyectos

Este directorio contiene scripts automatizados para facilitar la migración del proyecto **Innovation Platforms** a **InnovaProyectos**.

---

## 📋 Requisitos Previos

1. **Node.js 18+** instalado
2. **Firebase CLI** instalado y configurado
3. **Service Account Keys** de ambos proyectos Firebase:
   - `innovationplatforms-key.json` (proyecto actual)
   - `innovaproyectos-key.json` (proyecto nuevo)

---

## 🔐 Obtener Service Account Keys

### Para el proyecto ACTUAL (Innovation Platforms):

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Seleccionar proyecto **innovationplatforms**
3. Settings ⚙️ → Project Settings → Service Accounts
4. Click en "Generate new private key"
5. Guardar como `scripts/innovationplatforms-key.json`

### Para el proyecto NUEVO (InnovaProyectos):

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Seleccionar proyecto **innovaproyectos**
3. Settings ⚙️ → Project Settings → Service Accounts
4. Click en "Generate new private key"
5. Guardar como `scripts/innovaproyectos-key.json`

⚠️ **IMPORTANTE:** 
- Estos archivos contienen credenciales sensibles
- NO subir a Git (ya están en .gitignore)
- Eliminar después de completar la migración

---

## 📦 Instalación de Dependencias

```bash
cd scripts
npm install
```

Esto instalará `firebase-admin` necesario para los scripts.

---

## 🚀 Uso de los Scripts

### 1️⃣ Exportar Datos (Proyecto Actual)

Este script exporta todas las colecciones de Firestore del proyecto actual a archivos JSON.

```bash
npm run export
# O directamente:
node export-firestore.js
```

**Lo que hace:**
- Exporta colecciones: users, research_projects, papers, collaborations, analytics
- Exporta subcolecciones: user_library
- Convierte Timestamps a formato ISO string
- Guarda archivos en `scripts/backup/`
- Crea archivo de metadata con información del backup

**Output esperado:**
```
✅ Firebase Admin inicializado correctamente

📦 Exportando colección: users...
   ✅ Exportados 25 documentos
   📄 Archivo: /path/to/scripts/backup/users.json

📦 Exportando colección: papers...
   ✅ Exportados 150 documentos
   📄 Archivo: /path/to/scripts/backup/papers.json

...

✅ Exportación completa
   Total de documentos exportados: 250
```

---

### 2️⃣ Importar Datos (Proyecto Nuevo)

Este script importa los datos exportados al nuevo proyecto InnovaProyectos.

```bash
npm run import
# O directamente:
node import-firestore.js
```

**Lo que hace:**
- Lee archivos JSON de `scripts/backup/`
- Convierte fechas ISO string de vuelta a Timestamps
- Importa en lotes de 500 documentos (límite de Firestore)
- Muestra progreso en tiempo real
- Sobrescribe documentos existentes con el mismo ID

**Output esperado:**
```
✅ Firebase Admin inicializado correctamente
   Proyecto destino: InnovaProyectos

📋 Metadata del backup:
   Fecha de exportación: 2025-10-26T...
   Proyecto origen: innovationplatforms
   Total documentos: 250

⚠️  ATENCIÓN: Esta operación importará datos al proyecto InnovaProyectos
   Presiona Ctrl+C para cancelar en los próximos 5 segundos...

📥 Importando colección: users...
   📝 Importados 25/25 documentos...
   ✅ Importación completa: 25 documentos

...

✅ Importación completa
   Total de documentos importados: 250
```

---

### 3️⃣ Verificar Migración

Este script verifica que todos los datos se hayan migrado correctamente.

```bash
npm run verify
# O directamente:
node verify-migration.js
```

**Lo que hace:**
- Cuenta documentos en cada colección
- Compara con metadata del backup
- Verifica índices compuestos
- Prueba queries comunes
- Genera reporte JSON detallado
- Muestra muestra de documentos

**Output esperado:**
```
🔍 Verificando migración a InnovaProyectos

📋 Verificando colecciones...

   ✅ users: 25 documentos
   ✅ research_projects: 10 documentos
   ✅ papers: 150 documentos
   ✅ collaborations: 5 documentos
   ✅ analytics: 20 documentos

🔍 Verificando índices compuestos...
   ✅ Proyectos por owner y fecha
   ✅ Papers por owner y publicación

📊 Comparación con backup original:
   Total en backup: 250 documentos
   Total importado: 250 documentos
   ✅ Los totales coinciden perfectamente

═══════════════════════════════════════
📊 RESUMEN DE VERIFICACIÓN
═══════════════════════════════════════
✅ Colecciones verificadas: 5
⚠️  Colecciones vacías: 0
❌ Colecciones con error: 0
📦 Total de documentos: 250
⏱️  Duración: 3.45s
═══════════════════════════════════════

✅ Verificación completada exitosamente
```

---

## 📁 Estructura de Archivos

```
scripts/
├── package.json              # Dependencias y scripts npm
├── README.md                 # Esta guía
├── export-firestore.js       # Script de exportación
├── import-firestore.js       # Script de importación
├── verify-migration.js       # Script de verificación
├── innovationplatforms-key.json  # Service account (NO subir a Git)
├── innovaproyectos-key.json      # Service account (NO subir a Git)
├── backup/                   # Directorio de backups (creado automáticamente)
│   ├── _metadata.json        # Metadata del backup
│   ├── users.json            # Datos de usuarios
│   ├── papers.json           # Datos de papers
│   ├── research_projects.json
│   ├── collaborations.json
│   ├── analytics.json
│   └── user_library.json     # Subcolecciones
└── verification-report.json  # Reporte de verificación (creado automáticamente)
```

---

## ⚠️ Consideraciones Importantes

### Límites de Firebase

**Plan Spark (Gratuito):**
- 50,000 lecturas/día
- 20,000 escrituras/día
- 1GB Storage
- Exportación/importación puede consumir cuota rápidamente

**Plan Blaze (Pay-as-you-go):**
- Sin límites estrictos
- Recomendado para migraciones grandes

### Timestamps

- Los scripts convierten automáticamente entre `Timestamp` y `ISO string`
- Las fechas se preservan exactamente
- No se pierde precisión en la conversión

### Batching

- Firestore limita a 500 operaciones por batch
- Los scripts manejan esto automáticamente
- Migraciones grandes pueden tomar varios minutos

### Idempotencia

- Los scripts son idempotentes
- Puedes ejecutarlos múltiples veces
- Los documentos existentes serán sobrescritos
- Útil si necesitas reintentar después de un error

---

## 🔧 Solución de Problemas

### Error: "Cannot find module 'firebase-admin'"

**Solución:**
```bash
cd scripts
npm install
```

### Error: "Cannot find module './innovationplatforms-key.json'"

**Solución:**
- Descargar service account key desde Firebase Console
- Guardar en directorio `scripts/` con el nombre exacto
- Verificar que el archivo existe: `ls -la scripts/*.json`

### Error: "Permission denied"

**Solución:**
- Verificar que el service account tenga rol de "Firebase Admin SDK Administrator Service Agent"
- En Firebase Console → IAM & Admin → verificar permisos

### Error: "Quota exceeded"

**Solución:**
- Esperar 24 horas para que la cuota se renueve (Plan Spark)
- Actualizar a Plan Blaze
- Ejecutar script en horarios de bajo uso

### Error: "Index required"

**Solución:**
```bash
# Desplegar índices antes de importar datos
firebase use innovaproyectos
firebase deploy --only firestore:indexes
```

---

## 📊 Ejemplo de Workflow Completo

```bash
# 1. Preparación
cd /Users/israelsamuels/innovation/scripts
npm install

# 2. Exportar datos del proyecto actual
node export-firestore.js
# Verificar que se creó scripts/backup/ con archivos

# 3. Cambiar a nuevo proyecto
cd ..
firebase use innovaproyectos

# 4. Desplegar reglas e índices primero
firebase deploy --only firestore:rules,firestore:indexes

# 5. Importar datos
cd scripts
node import-firestore.js

# 6. Verificar migración
node verify-migration.js

# 7. Revisar reporte
cat verification-report.json
```

---

## 🔒 Seguridad

1. **Service Account Keys son PRIVADOS**
   - No compartir
   - No subir a Git
   - Eliminar después de la migración

2. **Backup de seguridad**
   - Guardar archivos de `backup/` en ubicación segura
   - Mantener por al menos 30 días

3. **Verificación doble**
   - Siempre ejecutar `verify-migration.js` después de importar
   - Comparar conteos con Firebase Console manualmente

---

## 📞 Soporte

Si encuentras problemas:

1. Revisar logs de Firebase Console
2. Verificar permisos del service account
3. Consultar documentación oficial de Firebase
4. Revisar archivo `GUIA_MIGRACION_INNOVAPROYECTOS.md`

---

## ✅ Checklist

- [ ] Node.js 18+ instalado
- [ ] Firebase CLI instalado
- [ ] `npm install` ejecutado en `scripts/`
- [ ] Service account keys descargados
- [ ] Backup del proyecto actual realizado
- [ ] Nuevo proyecto Firebase creado
- [ ] Reglas e índices desplegados en nuevo proyecto
- [ ] Script de exportación ejecutado exitosamente
- [ ] Script de importación ejecutado exitosamente
- [ ] Script de verificación ejecutado sin errores
- [ ] Reporte de verificación revisado
- [ ] Datos verificados manualmente en Firebase Console
- [ ] Service account keys eliminados (después de completar)

---

**Última actualización:** 26 de octubre de 2025



