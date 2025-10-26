# 📋 Instrucciones de Migración para el Usuario

**Proyecto:** Innovation Platforms → InnovaProyectos  
**Fecha:** 26 de octubre de 2025

---

## ✅ Análisis Completado

He realizado un análisis completo de tu proyecto "Innovation Platforms" y he preparado todo lo necesario para la migración a "InnovaProyectos". 

### 📦 Archivos Creados:

1. **`ANALISIS_PROYECTO_ACTUAL.md`** - Análisis detallado del proyecto actual
2. **`GUIA_MIGRACION_INNOVAPROYECTOS.md`** - Guía completa paso a paso de migración
3. **`storage.rules`** - Reglas de seguridad para Firebase Storage
4. **Scripts de migración automatizados:**
   - `scripts/export-firestore.js` - Exportar datos
   - `scripts/import-firestore.js` - Importar datos
   - `scripts/verify-migration.js` - Verificar migración
   - `scripts/README.md` - Documentación de scripts
   - `scripts/package.json` - Dependencias de scripts

---

## 🚀 Pasos para Realizar la Migración

La migración está dividida en fases. Puedes hacerla tú mismo siguiendo estos pasos:

### FASE 1: Preparación (15 minutos)

1. **Leer documentación:**
   ```bash
   # Leer estos archivos en orden:
   open ANALISIS_PROYECTO_ACTUAL.md
   open GUIA_MIGRACION_INNOVAPROYECTOS.md
   ```

2. **Instalar Firebase CLI (si no lo tienes):**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

3. **Verificar acceso a Firebase:**
   ```bash
   firebase projects:list
   # Deberías ver: innovationplatforms
   ```

---

### FASE 2: Crear Nuevo Proyecto (15 minutos)

1. **Ir a Firebase Console:**
   - Abrir: https://console.firebase.google.com/
   - Click en "Agregar proyecto"
   - Nombre: **InnovaProyectos**
   - ID: `innovaproyectos` (verificar disponibilidad)
   - Google Analytics: Opcional (recomiendo **No** por ahora)

2. **Configurar servicios:**
   - Habilitar **Authentication** → Email/Password
   - Habilitar **Firestore** → Modo Producción → Ubicación: us-central
   - Habilitar **Storage** → Modo Producción
   - Configurar plan: Spark (gratis) o Blaze (recomendado si actual usa Blaze)

---

### FASE 3: Exportar Datos (30 minutos)

1. **Descargar Service Account Key del proyecto ACTUAL:**
   - Firebase Console → innovationplatforms
   - ⚙️ Settings → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Guardar como: `scripts/innovationplatforms-key.json`

2. **Instalar dependencias de scripts:**
   ```bash
   cd scripts
   npm install
   ```

3. **Exportar datos:**
   ```bash
   npm run export
   # O: node export-firestore.js
   ```

4. **Verificar backup:**
   ```bash
   ls -la backup/
   # Deberías ver: users.json, papers.json, etc.
   ```

---

### FASE 4: Configurar Nuevo Proyecto (20 minutos)

1. **Cambiar a nuevo proyecto:**
   ```bash
   cd ..  # Volver a raíz del proyecto
   firebase use --add
   # Seleccionar: innovaproyectos
   # Alias: default
   ```

2. **Desplegar reglas e índices:**
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage:rules
   ```

3. **Esperar a que índices se creen:**
   - Firebase Console → Firestore → Índices
   - Esperar hasta que todos muestren "✅ Habilitado"
   - Puede tomar 5-15 minutos

---

### FASE 5: Importar Datos (30 minutos - 2 horas)

1. **Descargar Service Account Key del proyecto NUEVO:**
   - Firebase Console → innovaproyectos
   - ⚙️ Settings → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Guardar como: `scripts/innovaproyectos-key.json`

2. **Importar datos:**
   ```bash
   cd scripts
   npm run import
   # Confirmar cuando pregunte (esperar 5 segundos)
   ```

3. **Verificar migración:**
   ```bash
   npm run verify
   ```

4. **Revisar reporte:**
   ```bash
   cat verification-report.json
   # Verificar que todos los conteos sean correctos
   ```

---

### FASE 6: Actualizar Configuración Local (15 minutos)

1. **Actualizar `.env.local`:**
   
   Necesitas obtener las nuevas credenciales del proyecto InnovaProyectos:
   
   - Firebase Console → innovaproyectos
   - ⚙️ Settings → Project Settings → General
   - Scroll down a "Your apps" → Click en el icono Web (</>)
   - Si no hay app web, crear una nueva:
     - Nickname: "InnovaProyectos Web"
     - Firebase Hosting: ✅ Seleccionado
     - Click "Register app"
   
   Copiar las credenciales y actualizar `.env.local`:
   
   ```env
   # Firebase Configuration - NUEVO PROYECTO
   NEXT_PUBLIC_FIREBASE_API_KEY=<nuevo_api_key>
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=innovaproyectos.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=innovaproyectos
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=innovaproyectos.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<nuevo_sender_id>
   NEXT_PUBLIC_FIREBASE_APP_ID=<nuevo_app_id>

   # Mantener las demás variables igual
   CROSSREF_API_KEY=...
   PUBMED_API_KEY=...
   NEXT_PUBLIC_OJS_BASE_URL=...
   NEXT_PUBLIC_OJS_API_KEY=...
   NEXT_PUBLIC_OJS_API_SECRET=...
   ```

2. **Actualizar `.firebaserc`:**
   
   El archivo ya debería estar actualizado, pero verificar:
   
   ```json
   {
     "projects": {
       "default": "innovaproyectos"
     }
   }
   ```

---

### FASE 7: Migrar Cloud Functions (20 minutos)

1. **Compilar funciones:**
   ```bash
   cd functions
   npm run build
   ```

2. **Desplegar funciones:**
   ```bash
   cd ..
   firebase deploy --only functions
   ```

3. **Verificar funciones:**
   ```bash
   firebase functions:list
   
   # Probar función de prueba:
   curl https://us-central1-innovaproyectos.cloudfunctions.net/helloWorld
   ```

---

### FASE 8: Desplegar Aplicación (30 minutos)

1. **Reconstruir aplicación con nuevas credenciales:**
   ```bash
   # Limpiar build anterior
   rm -rf .next out
   
   # Reconstruir
   npm run build
   ```

2. **Desplegar hosting:**
   ```bash
   firebase deploy --only hosting
   ```

3. **Verificar despliegue:**
   - Abrir: `https://innovaproyectos.web.app`
   - Probar login
   - Verificar que datos aparezcan correctamente
   - Probar crear/editar/eliminar paper

---

### FASE 9: Importar Usuarios (Opcional)

**NOTA:** Esto requiere que ambos proyectos estén en Plan Blaze.

Si tienes usuarios registrados y quieres migrarlos:

```bash
# Exportar usuarios del proyecto actual
firebase use innovationplatforms
firebase auth:export users-export.json --format=JSON

# Importar al nuevo proyecto
firebase use innovaproyectos
firebase auth:import users-export.json --hash-algo=scrypt

# Los usuarios podrán iniciar sesión con las mismas contraseñas
```

**Si no puedes exportar usuarios:**
- Opción 1: Los usuarios se registran nuevamente
- Opción 2: Los usuarios usan "Olvidé mi contraseña" con su email

---

### FASE 10: Configurar Dominio (Opcional)

Si tienes dominio personalizado:

1. Firebase Console → Hosting → "Agregar dominio personalizado"
2. Ingresar tu dominio
3. Seguir instrucciones de verificación DNS
4. Esperar propagación (24-48 horas)

---

### FASE 11: Limpieza y Seguridad (10 minutos)

1. **Eliminar service account keys:**
   ```bash
   cd scripts
   rm innovationplatforms-key.json
   rm innovaproyectos-key.json
   ```

2. **Mover backups a ubicación segura:**
   ```bash
   mkdir -p ~/firebase-backups/innovation-migration-2025
   mv backup/* ~/firebase-backups/innovation-migration-2025/
   ```

3. **Commit cambios:**
   ```bash
   cd ..
   git add .
   git commit -m "chore: migrate to InnovaProyectos Firebase project"
   git push
   ```

---

## ⏱️ Tiempo Total Estimado

- **Migración básica:** 3-4 horas
- **Migración completa (con usuarios y verificación):** 6-8 horas

---

## ✅ Checklist de Verificación Final

Antes de considerar la migración completa, verificar:

- [ ] Nuevo proyecto creado en Firebase Console
- [ ] Todos los servicios habilitados (Auth, Firestore, Storage, Functions, Hosting)
- [ ] Datos exportados del proyecto actual
- [ ] Reglas e índices desplegados en nuevo proyecto
- [ ] Datos importados al nuevo proyecto
- [ ] Script de verificación ejecutado sin errores
- [ ] Variables de entorno actualizadas
- [ ] Aplicación reconstruida con nuevas credenciales
- [ ] Hosting desplegado en nuevo proyecto
- [ ] Cloud Functions desplegadas y funcionando
- [ ] Login funciona correctamente
- [ ] Datos del usuario se muestran correctamente
- [ ] Crear/editar/eliminar papers funciona
- [ ] Búsqueda funciona
- [ ] Dashboard muestra estadísticas
- [ ] Formularios funcionan (ContactForm, AddPaper, etc.)
- [ ] Responsive funciona en móvil
- [ ] Service account keys eliminados
- [ ] Backups guardados en ubicación segura

---

## 🆘 Si Algo Sale Mal

### El proyecto actual sigue funcionando

Durante toda la migración, el proyecto **innovationplatforms** permanece intacto y funcional. Puedes:

1. Continuar usando el proyecto actual mientras migras
2. Probar el nuevo proyecto sin afectar el actual
3. Volver al proyecto actual si encuentras problemas

### Para volver al proyecto actual:

```bash
firebase use innovationplatforms
```

### Si necesitas ayuda:

1. Revisar logs: `firebase functions:log`
2. Verificar Firebase Console para errores
3. Consultar `GUIA_MIGRACION_INNOVAPROYECTOS.md` sección "Solución de Problemas"
4. Verificar que service account keys tengan permisos correctos

---

## 📞 Recursos Adicionales

- **Documentación de Firebase:** https://firebase.google.com/docs
- **Firebase CLI Reference:** https://firebase.google.com/docs/cli
- **Next.js + Firebase:** https://firebase.google.com/docs/web/setup

---

## 🎯 Resultado Final Esperado

Después de completar todos los pasos:

1. ✅ Aplicación desplegada en: `https://innovaproyectos.web.app`
2. ✅ Todos los datos migrados correctamente
3. ✅ Usuarios pueden iniciar sesión
4. ✅ Todas las funcionalidades operativas
5. ✅ Cloud Functions funcionando
6. ✅ Proyecto original intacto como backup

---

## 🔒 Seguridad Post-Migración

### Cambiar contraseña de OJS (URGENTE)

Como se mencionó anteriormente, las credenciales de OJS fueron expuestas. **DEBES cambiarlas inmediatamente**:

1. Ir a: https://relaticpanama.org/_journals
2. Login como administrador
3. User Profile → Password
4. Cambiar contraseña
5. Actualizar `.env.local` con nuevas credenciales OJS

### Revisar reglas de seguridad

Verificar en Firebase Console que las reglas se hayan desplegado correctamente:

- Firestore Rules: Basadas en propiedad (ownerId)
- Storage Rules: Basadas en userId y tipo de archivo
- Authentication: Email/Password habilitado

---

## 📝 Notas Finales

1. **Mantén el proyecto actual por 30 días:** Como backup de seguridad.
2. **Monitorea el nuevo proyecto:** Revisa métricas diarias la primera semana.
3. **Documenta cualquier cambio:** Si modificas algo, actualiza la documentación.

---

**¿Listo para empezar?** 🚀

Comienza con **FASE 1: Preparación** y sigue los pasos en orden.

Si tienes dudas, consulta `GUIA_MIGRACION_INNOVAPROYECTOS.md` para información más detallada.

---

**¡Buena suerte con la migración!** 🎉



