/**
 * Metrics Service - Reemplaza la Cloud Function getResearchMetrics
 * Plan Spark compatible - Calcula métricas directamente desde Firestore
 */

import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ResearchMetrics {
  totalPapers: number;
  totalProjects: number;
  activeCollaborations: number;
  papersThisMonth: number;
  projectsThisMonth: number;
}

/**
 * Obtiene métricas de investigación para un usuario
 * @param userId - ID del usuario
 * @returns Métricas calculadas
 */
export async function getResearchMetrics(userId: string): Promise<ResearchMetrics> {
  try {
    // Calcular fecha de inicio del mes actual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Query para papers del usuario
    const papersQuery = query(
      collection(db, 'papers'),
      where('ownerId', '==', userId)
    );
    const papersSnapshot = await getDocs(papersQuery);
    
    // Papers de este mes
    const papersThisMonth = papersSnapshot.docs.filter(doc => {
      const createdAt = doc.data().createdAt?.toDate();
      return createdAt && createdAt >= startOfMonth;
    }).length;

    // Query para proyectos del usuario
    const projectsQuery = query(
      collection(db, 'research_projects'),
      where('ownerId', '==', userId)
    );
    const projectsSnapshot = await getDocs(projectsQuery);
    
    // Proyectos de este mes
    const projectsThisMonth = projectsSnapshot.docs.filter(doc => {
      const createdAt = doc.data().createdAt?.toDate();
      return createdAt && createdAt >= startOfMonth;
    }).length;

    // Query para colaboraciones donde el usuario participa
    const collaborationsQuery = query(
      collection(db, 'collaborations'),
      where(`participants.${userId}`, '!=', null)
    );
    const collaborationsSnapshot = await getDocs(collaborationsQuery);

    return {
      totalPapers: papersSnapshot.size,
      totalProjects: projectsSnapshot.size,
      activeCollaborations: collaborationsSnapshot.size,
      papersThisMonth,
      projectsThisMonth,
    };
  } catch (error) {
    console.error('Error getting research metrics:', error);
    throw new Error('Failed to retrieve research metrics');
  }
}

/**
 * Obtiene métricas globales (solo para admin)
 * @returns Métricas globales del sistema
 */
export async function getGlobalMetrics() {
  try {
    const [papersSnapshot, projectsSnapshot, usersSnapshot] = await Promise.all([
      getDocs(collection(db, 'papers')),
      getDocs(collection(db, 'research_projects')),
      getDocs(collection(db, 'users')),
    ]);

    return {
      totalPapers: papersSnapshot.size,
      totalProjects: projectsSnapshot.size,
      totalUsers: usersSnapshot.size,
    };
  } catch (error) {
    console.error('Error getting global metrics:', error);
    throw new Error('Failed to retrieve global metrics');
  }
}

