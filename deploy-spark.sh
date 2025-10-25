#!/bin/bash

# 🚀 Script de Despliegue Automático - Plan Spark (Gratuito)
# Este script despliega tu aplicación usando solo los servicios gratuitos de Firebase

set -e  # Detener en caso de error

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔨 CONSTRUCCIÓN DE LA APLICACIÓN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm run build

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚙️  CONFIGURACIÓN PARA PLAN SPARK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
# Backup del firebase.json actual si existe
if [ -f firebase.json ]; then
    cp firebase.json firebase.backup.json
    echo "✓ Backup creado: firebase.backup.json"
fi

# Usar configuración sin Cloud Functions
cp firebase.spark.json firebase.json
echo "✓ Usando firebase.spark.json (sin Cloud Functions)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 DESPLEGANDO A FIREBASE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
firebase deploy --only hosting,firestore

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DESPLIEGUE COMPLETADO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Tu aplicación está en vivo en:"
echo "   https://innovationplatforms.web.app"
echo ""
echo "📊 Ver consola de Firebase:"
echo "   https://console.firebase.google.com/project/innovationplatforms"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

