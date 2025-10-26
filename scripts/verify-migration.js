/**
 * Script de Verificación de Migración
 * 
 * Verifica que todos los datos se hayan migrado correctamente
 * 
 * Uso:
 *   1. Asegurarse de tener innovaproyectos-key.json
 *   2. Ejecutar: node scripts/verify-migration.js
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
} catch (error) {
  console.error('❌ Error al inicializar Firebase Admin');
  console.error('   Asegúrate de tener el archivo innovaproyectos-key.json');
  process.exit(1);
}

const db = admin.firestore();

/**
 * Verifica una colección
 */
async function verifyCollection(collectionName) {
  try {
    // Contar documentos
    const countSnapshot = await db.collection(collectionName).count().get();
    const count = countSnapshot.data().count;
    
    // Obtener un documento de muestra
    const sampleSnapshot = await db.collection(collectionName).limit(1).get();
    
    if (sampleSnapshot.empty) {
      console.log(`   ⚠️  ${collectionName}: Colección vacía`);
      return { collection: collectionName, count: 0, status: 'empty', sample: null };
    } else {
      const sampleDoc = sampleSnapshot.docs[0];
      console.log(`   ✅ ${collectionName}: ${count} documentos`);
      return { 
        collection: collectionName, 
        count: count, 
        status: 'ok',
        sampleId: sampleDoc.id
      };
    }
  } catch (error) {
    console.log(`   ❌ ${collectionName}: Error - ${error.message}`);
    return { collection: collectionName, count: 0, status: 'error', error: error.message };
  }
}

/**
 * Verifica índices compuestos
 */
async function verifyIndexes() {
  console.log('\n🔍 Verificando índices compuestos...');
  
  const testQueries = [
    {
      name: 'Proyectos por owner y fecha',
      test: async () => {
        const q = db.collection('research_projects')
          .where('ownerId', '==', 'test-user')
          .orderBy('createdAt', 'desc')
          .limit(1);
        await q.get();
      }
    },
    {
      name: 'Papers por owner y publicación',
      test: async () => {
        const q = db.collection('papers')
          .where('ownerId', '==', 'test-user')
          .orderBy('publicationDate', 'desc')
          .limit(1);
        await q.get();
      }
    }
  ];
  
  for (const query of testQueries) {
    try {
      await query.test();
      console.log(`   ✅ ${query.name}`);
    } catch (error) {
      if (error.code === 9) {
        console.log(`   ⚠️  ${query.name}: Índice requerido (ejecutar: firebase deploy --only firestore:indexes)`);
      } else {
        console.log(`   ❌ ${query.name}: ${error.message}`);
      }
    }
  }
}

/**
 * Compara con metadata de backup
 */
async function compareWithBackup(results) {
  const metadataPath = path.join(__dirname, 'backup', '_metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('\n⚠️  No se encontró metadata del backup para comparar');
    return;
  }
  
  console.log('\n📊 Comparación con backup original:');
  
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  console.log(`   Fecha de exportación: ${metadata.exportDate}`);
  console.log(`   Total en backup: ${metadata.totalDocuments} documentos`);
  
  const currentTotal = results.reduce((sum, r) => sum + r.count, 0);
  console.log(`   Total importado: ${currentTotal} documentos`);
  
  if (currentTotal === metadata.totalDocuments) {
    console.log('   ✅ Los totales coinciden perfectamente');
  } else {
    console.log(`   ⚠️  Diferencia: ${metadata.totalDocuments - currentTotal} documentos`);
  }
  
  // Comparar por colección
  console.log('\n   Detalle por colección:');
  for (const result of results) {
    console.log(`   - ${result.collection}: ${result.count} docs`);
  }
}

/**
 * Genera reporte HTML
 */
function generateReport(results, startTime) {
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  const totalDocs = results.reduce((sum, r) => sum + r.count, 0);
  const successful = results.filter(r => r.status === 'ok').length;
  const failed = results.filter(r => r.status === 'error').length;
  const empty = results.filter(r => r.status === 'empty').length;
  
  const report = {
    timestamp: new Date().toISOString(),
    project: 'innovaproyectos',
    duration: `${duration}s`,
    summary: {
      totalCollections: results.length,
      successful,
      failed,
      empty,
      totalDocuments: totalDocs
    },
    collections: results
  };
  
  const reportPath = path.join(__dirname, 'verification-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n📄 Reporte guardado en: ${reportPath}`);
  
  return report;
}

/**
 * Función principal
 */
async function verifyMigration() {
  console.log('🔍 Verificando migración a InnovaProyectos');
  console.log('   Fecha:', new Date().toISOString());
  console.log('\n📋 Verificando colecciones...\n');
  
  const startTime = Date.now();
  
  const collections = [
    'users',
    'research_projects',
    'papers',
    'collaborations',
    'analytics'
  ];
  
  const results = [];
  
  // Verificar cada colección
  for (const collection of collections) {
    const result = await verifyCollection(collection);
    results.push(result);
  }
  
  // Verificar índices
  await verifyIndexes();
  
  // Comparar con backup
  await compareWithBackup(results);
  
  // Generar reporte
  const report = generateReport(results, startTime);
  
  // Resumen final
  console.log('\n═══════════════════════════════════════');
  console.log('📊 RESUMEN DE VERIFICACIÓN');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Colecciones verificadas: ${report.summary.successful}`);
  console.log(`⚠️  Colecciones vacías: ${report.summary.empty}`);
  console.log(`❌ Colecciones con error: ${report.summary.failed}`);
  console.log(`📦 Total de documentos: ${report.summary.totalDocuments}`);
  console.log(`⏱️  Duración: ${report.duration}`);
  console.log('═══════════════════════════════════════\n');
  
  if (report.summary.failed > 0) {
    console.log('⚠️  Algunas verificaciones fallaron. Revisa el reporte para detalles.');
    process.exitCode = 1;
  } else {
    console.log('✅ Verificación completada exitosamente');
  }
  
  // Cerrar conexión
  await admin.app().delete();
}

// Ejecutar
verifyMigration().catch(error => {
  console.error('\n❌ Error fatal:', error);
  process.exit(1);
});



