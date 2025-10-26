# 📚 Guía de Integración con OJS (Open Journal Systems)

## 🎯 Descripción General

Esta guía explica cómo configurar y utilizar la integración entre nuestro sistema y OJS para enviar papers científicos a revistas académicas.

## 📋 Tabla de Contenidos

1. [Prerequisitos](#prerequisitos)
2. [Configuración de OJS](#configuración-de-ojs)
3. [Configuración en el Sistema](#configuración-en-el-sistema)
4. [Uso de la Integración](#uso-de-la-integración)
5. [Solución de Problemas](#solución-de-problemas)
6. [Referencias](#referencias)

---

## 📌 Prerequisitos

### En OJS:

1. **Rol de Administrador** en la revista OJS
2. **Habilitar la API** en OJS
3. **Generar credenciales API** (API Key y API Secret)
4. **Permisos adecuados** para crear submissions

### En el Sistema:

- Firebase configurado y funcionando
- Variables de entorno configuradas

---

## 🔧 Configuración de OJS

### Paso 1: Habilitar la API en OJS

1. Inicia sesión como **administrador** en OJS
2. Ve a **Settings** → **Website** → **Plugins**
3. Busca **"RESTful API"** y habilítalo
4. Guarda los cambios

### Paso 2: Generar Credenciales API

1. En OJS, ve a **Settings** → **Users & Roles** → **API Users**
2. Haz clic en **"Create API User"**
3. Configura:
   - **Username**: (ej: `api_integration`)
   - **Password**: (genera una contraseña segura)
   - **Enabled**: ✅
4. Anota el **API Key** y **API Secret** generados
5. **¡IMPORTANTE!** Guarda estas credenciales de forma segura

### Paso 3: Configurar Permisos

Asegúrate de que el usuario API tenga:
- Permisos para crear submissions
- Acceso a la sección de la revista donde quieres enviar papers

---

## ⚙️ Configuración en el Sistema

### Paso 1: Configurar Variables de Entorno

Edita el archivo `.env.local` (si no existe, créalo desde `env.example`):

```env
# OJS Integration
NEXT_PUBLIC_OJS_BASE_URL=https://relaticpanama.org/_journals
NEXT_PUBLIC_OJS_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_OJS_API_SECRET=tu_api_secret_aqui
```

### Paso 2: Reiniciar el Servidor

Después de agregar las variables de entorno, reinicia el servidor de desarrollo:

```bash
npm run dev
```

---

## 🚀 Uso de la Integración

### Cómo Enviar un Paper a OJS

1. **Abre el formulario "Add New Paper"**
   - Navega a Research → "Add New Paper"

2. **Completa los datos del paper**
   - Título (obligatorio)
   - Autores (obligatorio)
   - Abstract
   - Tags
   - Otros metadatos

3. **Marca la casilla "Also submit to journal (OJS)"**
   - Aparece al final del formulario
   - Solo marca si quieres enviar a OJS

4. **Haz clic en "Add Paper"**

### Resultados Posibles

#### ✅ Éxito
```
Paper added successfully! Submission ID: 12345
```
- El paper se guardó en tu biblioteca
- Se envió correctamente a OJS
- Obtienes un ID de envío

#### ⚠️ Parcial
```
Paper saved locally, but OJS submission failed.
Error: [detalle del error]
```
- El paper se guardó en tu biblioteca
- No se pudo enviar a OJS
- Revisa la consola para más detalles

#### ❌ Error
```
Error adding paper. Please try again.
```
- No se guardó el paper
- Revisa que los campos obligatorios estén completos

---

## 🐛 Solución de Problemas

### Error: "OJS API credentials not configured"

**Causa**: No se configuraron las variables de entorno.

**Solución**:
1. Verifica que el archivo `.env.local` existe
2. Verifica que las variables `NEXT_PUBLIC_OJS_API_KEY` y `NEXT_PUBLIC_OJS_API_SECRET` están configuradas
3. Reinicia el servidor

### Error: "401 Unauthorized"

**Causa**: Credenciales incorrectas o usuario API deshabilitado.

**Solución**:
1. Verifica que el API Key y API Secret son correctos
2. Verifica que el usuario API está habilitado en OJS
3. Regenera las credenciales si es necesario

### Error: "404 Not Found"

**Causa**: La URL del endpoint es incorrecta.

**Solución**:
1. Verifica que `NEXT_PUBLIC_OJS_BASE_URL` es correcta
2. Verifica que la API está habilitada en OJS
3. Consulta la documentación de tu versión de OJS

### Error: "422 Unprocessable Entity"

**Causa**: El formato de los datos enviados no es correcto.

**Solución**:
1. Verifica que el paper tiene título y al menos un autor
2. Revisa los logs en la consola del navegador
3. Consulta la documentación de la API de OJS para el formato esperado

### El paper no aparece en OJS

**Posibles causas**:
1. Las credenciales no tienen permisos suficientes
2. El usuario API no tiene acceso a la sección
3. Hay problemas de red (CORS, firewall)

**Solución**:
1. Verifica los permisos del usuario API en OJS
2. Intenta hacer una petición de prueba manual (ver abajo)
3. Revisa los logs del servidor OJS

### Prueba Manual de la API

Puedes probar la conexión manualmente con curl:

```bash
curl -X GET \
  'https://relaticpanama.org/_journals/index.php/api/v1/submissions' \
  -H 'Authorization: Basic [base64(username:password)]' \
  -H 'Accept: application/json'
```

---

## 📚 Referencias

### Documentación Oficial

- **OJS API Documentation**: https://docs.pkp.sfu.ca/dev/
- **RESTful API Plugin**: https://docs.pkp.sfu.ca/learning-ojs/en/configuration#restful-api-plugin
- **API Examples**: https://docs.pkp.sfu.ca/dev/api-guide/

### Endpoints Principales

- **Base URL**: `https://relaticpanama.org/_journals`
- **API Endpoint**: `/index.php/api/v1/submissions`
- **Autenticación**: HTTP Basic Auth (API Key:API Secret)

### Formatos de Datos

#### Estructura de Submission (POST /submissions)

```json
{
  "title": "Título del Paper",
  "abstract": "Abstract del paper...",
  "keywords": ["keyword1", "keyword2"],
  "sections": ["Articles"],
  "locale": "en_US",
  "authors": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "affiliation": "University",
      "country": "Panama",
      "orcid": "",
      "userGroupId": 14,
      "primaryContact": true
    }
  ]
}
```

---

## 🔒 Seguridad

### Buenas Prácticas

1. **Nunca commites** el archivo `.env.local` al repositorio
2. **Rota las credenciales** periódicamente
3. **Usa HTTPS** siempre para las conexiones
4. **Mantén actualizado** OJS para parches de seguridad
5. **Limita los permisos** del usuario API solo a lo necesario

---

## 📞 Soporte

Si tienes problemas con la integración:

1. Revisa esta guía completa
2. Consulta los logs en la consola del navegador (F12)
3. Verifica los logs del servidor OJS
4. Contacta al administrador del sistema

---

## ✅ Checklist de Implementación

- [ ] OJS tiene la API habilitada
- [ ] Credenciales API generadas y guardadas
- [ ] Variables de entorno configuradas
- [ ] Servidor reiniciado
- [ ] Prueba de conexión exitosa
- [ ] Paper de prueba enviado correctamente
- [ ] Paper aparece en OJS

---

**Última actualización**: Enero 2025  
**Versión de la Integración**: 1.0.0



