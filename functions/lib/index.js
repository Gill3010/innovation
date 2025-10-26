"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateText = exports.searchExternalPapers = exports.getResearchMetrics = exports.helloWorld = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const https = require("https");
// Inicializar Firebase Admin
admin.initializeApp();
// Función básica de prueba
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});
// Función para obtener métricas de investigación (simplificada)
exports.getResearchMetrics = functions.https.onRequest(async (request, response) => {
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
    }
    catch (error) {
        console.error('Error getting research metrics:', error);
        response.status(500).json({ error: 'Error retrieving metrics' });
    }
});
// Función para buscar papers en APIs externas (simplificada)
exports.searchExternalPapers = functions.https.onRequest(async (request, response) => {
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
    }
    catch (error) {
        console.error('Error searching external papers:', error);
        response.status(500).json({ error: 'Error searching external papers' });
    }
});
// Función proxy para traducir texto usando LibreTranslate
exports.translateText = functions.https.onRequest(async (request, response) => {
    // Configurar CORS headers
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    // Manejar preflight requests
    if (request.method === 'OPTIONS') {
        response.status(204).send('');
        return;
    }
    // Solo permitir POST requests
    if (request.method !== 'POST') {
        response.status(405).json({ error: 'Method not allowed' });
        return;
    }
    try {
        const { q, source, target, format } = request.body;
        // Validar parámetros requeridos
        if (!q || !target) {
            response.status(400).json({ error: 'Missing required parameters: q (text) and target (language)' });
            return;
        }
        // Preparar datos para LibreTranslate
        const postData = JSON.stringify({
            q: q,
            source: source || 'auto',
            target: target,
            format: format || 'text'
        });
        // Configurar opciones para la petición a LibreTranslate
        const options = {
            hostname: 'libretranslate.de',
            port: 443,
            path: '/translate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'User-Agent': 'Firebase-Cloud-Function/1.0'
            }
        };
        // Realizar petición a LibreTranslate
        const libretranslateRequest = https.request(options, (libretranslateResponse) => {
            let data = '';
            libretranslateResponse.on('data', (chunk) => {
                data += chunk;
            });
            libretranslateResponse.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (libretranslateResponse.statusCode === 200) {
                        response.json(result);
                    }
                    else {
                        console.error('LibreTranslate API error:', libretranslateResponse.statusCode, data);
                        response.status(libretranslateResponse.statusCode || 500).json({
                            error: 'Translation service error',
                            details: data
                        });
                    }
                }
                catch (parseError) {
                    console.error('Error parsing LibreTranslate response:', parseError);
                    response.status(500).json({ error: 'Error parsing translation response' });
                }
            });
        });
        libretranslateRequest.on('error', (error) => {
            console.error('Error making request to LibreTranslate:', error);
            response.status(500).json({ error: 'Translation service unavailable' });
        });
        // Enviar datos a LibreTranslate
        libretranslateRequest.write(postData);
        libretranslateRequest.end();
    }
    catch (error) {
        console.error('Error in translateText function:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
});
//# sourceMappingURL=index.js.map