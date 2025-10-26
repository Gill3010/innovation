/**
 * Script de Importación de Firestore
 * 
 * Importa todas las colecciones desde archivos JSON al nuevo proyecto
 * 
 * Uso:
 *   1. Descargar service account key del proyecto NUEVO (InnovaProyectos)
 *   2. Guardarlo como 'innovaproyectos-key.json' en el directorio scripts/
 *   3. Asegurarse de tener los archivos de backup generados
 *   4. Ejecutar: node scripts/import-firestore.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Inicializar con NUEVO proyecto
try {
  const serviceAccount = require('./innovaproyectos-key.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('✅ Firebase Admin inicializado correctamente');
  console.log('   Proyecto destino: InnovaProyectos');
} catch (error) {
  console.error('❌ Error al inicializar Firebase Admin');
  console.error('   Asegúrate de tener el archivo innovaproyectos-key.json en el directorio scripts/');
  console.error('   Descárgalo desde Firebase Console → Project Settings → Service Accounts');
  process.exit(1);
}

const db = admin.firestore();

/**
 * Importa una colección desde archivo JSON
 */
async function importCollection(collectionName) {
  console.log(`\n📥 Importando colección: ${collectionName}...`);
  
  const filePath = path.join(__dirname, 'backup', `${collectionName}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`   ⚠️  Archivo no encontrado: ${filePath}`);
    console.log(`   ⏭️  Saltando ${collectionName}`);
    return 0;
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (data.length === 0) {
      console.log(`   ℹ️  No hay documentos para importar en ${collectionName}`);
      return 0;
    }
    
    const batchSize = 500; // Límite de Firestore
    let processedCount = 0;
    
    // Procesar en lotes de 500
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = db.batch();
      const chunk = data.slice(i, i + batchSize);
      
      for (const item of chunk) {
        const docRef = db.collection(collectionName).doc(item.id);
        
        // Convertir strings de fecha de vuelta a Timestamps
        const processedData = {};
        for (const [key, value] of Object.entries(item.data)) {
          // Detectar strings de fecha ISO
          if (
            typeof value === 'string' && 
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
          ) {
            processedData[key] = admin.firestore.Timestamp.fromDate(new Date(value));
          } else {
            processedData[key] = value;
          }
        }
        
        batch.set(docRef, processedData);
        processedCount++;
      }
      
      await batch.commit();
      console.log(`   📝 Importados ${processedCount}/${data.length} documentos...`);
    }
    
    console.log(`   ✅ Importación completa: ${processedCount} documentos`);
    return processedCount;
    
  } catch (error) {
    console.error(`   ❌ Error importando ${collectionName}:`, error.message);
    return 0;
  }
}

/**
 * Importa subcolecciones (ej: user_library)
 */
async function importSubcollections() {
  console.log('\n📥 Importando subcolecciones...');
  
  const filePath = path.join(__dirname, 'backup', 'user_library.json');
  
  if (!fs.existsSync(filePath)) {
    console.log('   ℹ️  No hay datos de bibliotecas para importar');
    return 0;
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (data.length === 0) {
      console.log('   ℹ️  No hay documentos para importar en bibliotecas');
      return 0;
    }
    
    const batchSize = 500;
    let processedCount = 0;
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = db.batch();
      const chunk = data.slice(i, i + batchSize);
      
      for (const item of chunk) {
        const docRef = db
          .collection('user_library')
          .doc(item.userId)
          .collection('papers')
          .doc(item.paperId);
        
        // Convertir strings de fecha de vuelta a Timestamps
        const processedData = {};
        for (const [key, value] of Object.entries(item.data)) {
          if (
            typeof value === 'string' && 
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
          ) {
            processedData[key] = admin.firestore.Timestamp.fromDate(new Date(value));
          } else {
            processedData[key] = value;
          }
        }
        
        batch.set(docRef, processedData);
        processedCount++;
      }
      
      await batch.commit();
      console.log(`   📝 Importados ${processedCount}/${data.length} documentos...`);
    }
    
    console.log(`   ✅ Importación completa: ${processedCount} documentos`);
    return processedCount;
    
  } catch (error) {
    console.error('   ❌ Error importando subcolecciones:', error.message);
    return 0;
  }
}

/**
 * Función principal
 */
async function importAllData() {
  console.log('🚀 Iniciando importación a Firestore');
  console.log('   Proyecto destino: InnovaProyectos');
  console.log('   Fecha:', new Date().toISOString());
  
  // Verificar que exista el directorio de backup
  const backupDir = path.join(__dirname, 'backup');
  if (!fs.existsSync(backupDir)) {
    console.error('\n❌ Error: No se encontró el directorio de backup');
    console.error('   Ejecuta primero: node scripts/export-firestore.js');
    process.exit(1);
  }
  
  // Leer metadata
  const metadataPath = path.join(backupDir, '_metadata.json');
  if (fs.existsSync(metadataPath)) {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    console.log('\n📋 Metadata del backup:');
    console.log(`   Fecha de exportación: ${metadata.exportDate}`);
    console.log(`   Proyecto origen: ${metadata.project}`);
    console.log(`   Total documentos: ${metadata.totalDocuments}`);
  }
  
  // Confirmación de seguridad
  console.log('\n⚠️  ATENCIÓN: Esta operación importará datos al proyecto InnovaProyectos');
  console.log('   Los documentos existentes con el mismo ID serán SOBRESCRITOS');
  console.log('   Asegúrate de que el proyecto destino sea el correcto');
  console.log('\n   Presiona Ctrl+C para cancelar en los próximos 5 segundos...');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const collections = [
    'users',
    'research_projects',
    'papers',
    'collaborations',
    'analytics'
  ];
  
  let totalDocs = 0;
  
  // Importar colecciones principales
  for (const collection of collections) {
    const count = await importCollection(collection);
    totalDocs += count;
  }
  
  // Importar subcolecciones
  const subCount = await importSubcollections();
  totalDocs += subCount;
  
  console.log('\n✅ Importación completa');
  console.log(`   Total de documentos importados: ${totalDocs}`);
  console.log(`   Proyecto: InnovaProyectos`);
  
  // Cerrar conexión
  await admin.app().delete();
  
  console.log('\n📌 Siguiente paso:');
  console.log('   Verificar los datos en Firebase Console');
  console.log('   Ejecutar: node scripts/verify-migration.js');
}

// Ejecutar
importAllData().catch(error => {
  console.error('\n❌ Error fatal:', error);
  process.exit(1);
});



