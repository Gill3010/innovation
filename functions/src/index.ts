import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Inicializar Firebase Admin
admin.initializeApp();

// Función básica de prueba
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// Función para obtener métricas de investigación (simplificada)
export const getResearchMetrics = functions.https.onRequest(async (request, response) => {
  try {
    const db = admin.firestore();
    
    // Obtener conteos básicos (sin filtros de usuario por ahora)
    const papersSnapshot = await db.collection('papers').get();
    const projectsSnapshot = await db.collection('research_projects').get();
    const collaborationsSnapshot = await db.collection('collaborations').get();

    const metrics = {
      totalPapers: papersSnapshot.size,
      totalProjects: projectsSnapshot.size,
      activeCollaborations: collaborationsSnapshot.size,
      papersThisMonth: 0, // Se calculará cuando tengamos datos reales
    };

    response.json(metrics);
  } catch (error) {
    console.error('Error getting research metrics:', error);
    response.status(500).json({ error: 'Error retrieving metrics' });
  }
});

// Función para buscar papers en APIs externas (simplificada)
export const searchExternalPapers = functions.https.onRequest(async (request, response) => {
  try {
    const { query, source } = request.body;
    
    if (!query) {
      response.status(400).json({ error: 'Query is required' });
      return;
    }

    // Por ahora retornamos un ejemplo
    const results = {
      results: [],
      source: source || 'crossref',
      query,
      message: 'External API search functionality will be implemented here'
    };

    response.json(results);
  } catch (error) {
    console.error('Error searching external papers:', error);
    response.status(500).json({ error: 'Error searching external papers' });
  }
});