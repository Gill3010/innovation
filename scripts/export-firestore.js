/**
 * Script de Exportación de Firestore
 * 
 * Exporta todas las colecciones del proyecto actual a archivos JSON
 * 
 * Uso:
 *   1. Descargar service account key del proyecto ACTUAL
 *   2. Guardarlo como 'innovationplatforms-key.json' en el directorio scripts/
 *   3. Ejecutar: node scripts/export-firestore.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Inicializar con proyecto actual
try {
  const serviceAccount = require('./innovationplatforms-key.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('✅ Firebase Admin inicializado correctamente');
} catch (error) {
  console.error('❌ Error al inicializar Firebase Admin');
  console.error('   Asegúrate de tener el archivo innovationplatforms-key.json en el directorio scripts/');
  console.error('   Descárgalo desde Firebase Console → Project Settings → Service Accounts');
  process.exit(1);
}

const db = admin.firestore();

/**
 * Exporta una colección completa a JSON
 */
async function exportCollection(collectionName) {
  console.log(`\n📦 Exportando colección: ${collectionName}...`);
  
  try {
    const snapshot = await db.collection(collectionName).get();
    const data = [];
    
    snapshot.forEach(doc => {
      const docData = doc.data();
      
      // Convertir Timestamps a formato ISO string
      const processedData = {};
      for (const [key, value] of Object.entries(docData)) {
        if (value && typeof value.toDate === 'function') {
          processedData[key] = value.toDate().toISOString();
        } else {
          processedData[key] = value;
        }
      }
      
      data.push({
        id: doc.id,
        data: processedData
      });
    });
    
    // Crear directorio backup si no existe
    const backupDir = path.join(__dirname, 'backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Guardar archivo JSON
    const filePath = path.join(backupDir, `${collectionName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    console.log(`   ✅ Exportados ${data.length} documentos`);
    console.log(`   📄 Archivo: ${filePath}`);
    
    return data.length;
  } catch (error) {
    console.error(`   ❌ Error exportando ${collectionName}:`, error.message);
    return 0;
  }
}

/**
 * Exporta subcolecciones (ej: user_library)
 */
async function exportSubcollections() {
  console.log('\n📦 Exportando subcolecciones...');
  
  try {
    // Obtener todos los usuarios para exportar sus bibliotecas
    const usersSnapshot = await db.collection('users').get();
    const libraryData = [];
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const librarySnapshot = await db
        .collection('user_library')
        .doc(userId)
        .collection('papers')
        .get();
      
      librarySnapshot.forEach(paperDoc => {
        const paperData = paperDoc.data();
        
        // Convertir Timestamps
        const processedData = {};
        for (const [key, value] of Object.entries(paperData)) {
          if (value && typeof value.toDate === 'function') {
            processedData[key] = value.toDate().toISOString();
          } else {
            processedData[key] = value;
          }
        }
        
        libraryData.push({
          userId: userId,
          paperId: paperDoc.id,
          data: processedData
        });
      });
    }
    
    if (libraryData.length > 0) {
      const filePath = path.join(__dirname, 'backup', 'user_library.json');
      fs.writeFileSync(filePath, JSON.stringify(libraryData, null, 2));
      console.log(`   ✅ Exportados ${libraryData.length} documentos de bibliotecas`);
      console.log(`   📄 Archivo: ${filePath}`);
    } else {
      console.log('   ℹ️  No hay datos en bibliotecas de usuario');
    }
    
    return libraryData.length;
  } catch (error) {
    console.error('   ❌ Error exportando subcolecciones:', error.message);
    return 0;
  }
}

/**
 * Función principal
 */
async function exportAllData() {
  console.log('🚀 Iniciando exportación de Firestore');
  console.log('   Proyecto: Innovation Platforms');
  console.log('   Fecha:', new Date().toISOString());
  
  const collections = [
    'users',
    'research_projects',
    'papers',
    'collaborations',
    'analytics'
  ];
  
  let totalDocs = 0;
  
  // Exportar colecciones principales
  for (const collection of collections) {
    const count = await exportCollection(collection);
    totalDocs += count;
  }
  
  // Exportar subcolecciones
  const subCount = await exportSubcollections();
  totalDocs += subCount;
  
  console.log('\n✅ Exportación completa');
  console.log(`   Total de documentos exportados: ${totalDocs}`);
  console.log(`   📁 Ubicación: ${path.join(__dirname, 'backup')}`);
  
  // Crear archivo de metadata
  const metadata = {
    exportDate: new Date().toISOString(),
    project: 'innovationplatforms',
    collections: collections,
    totalDocuments: totalDocs,
    version: '1.0'
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'backup', '_metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
  
  console.log('\n📋 Metadata guardado en _metadata.json');
  
  // Cerrar conexión
  await admin.app().delete();
}

// Ejecutar
exportAllData().catch(error => {
  console.error('\n❌ Error fatal:', error);
  process.exit(1);
});



