// Servicio de Firebase para gestión de datos científicos
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  User, 
  ResearchProject, 
  ScientificPaper, 
  Collaboration, 
  ResearchMetrics,
  DashboardStats,
  ActivityItem 
} from '@/types/scientific';

export class ScientificDataService {
  // ===== USUARIOS =====
  static async createUser(userData: Partial<User>): Promise<string> {
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async getUser(userId: string): Promise<User | null> {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  }

  static async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    });
  }

  // ===== PROYECTOS DE INVESTIGACIÓN =====
  static async createProject(projectData: Partial<ResearchProject>): Promise<string> {
    const docRef = await addDoc(collection(db, 'research_projects'), {
      ...projectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async getProjects(userId: string): Promise<ResearchProject[]> {
    const q = query(
      collection(db, 'research_projects'),
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate?.toDate ? data.startDate.toDate() : data.startDate,
        endDate: data.endDate?.toDate ? data.endDate.toDate() : data.endDate,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      };
    }) as ResearchProject[];
  }

  static async getProject(projectId: string): Promise<ResearchProject | null> {
    const docRef = doc(db, 'research_projects', projectId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ResearchProject;
    }
    return null;
  }

  static async updateProject(projectId: string, projectData: Partial<ResearchProject>): Promise<void> {
    const docRef = doc(db, 'research_projects', projectId);
    await updateDoc(docRef, {
      ...projectData,
      updatedAt: serverTimestamp(),
    });
  }

  static async deleteProject(projectId: string): Promise<void> {
    const docRef = doc(db, 'research_projects', projectId);
    await deleteDoc(docRef);
  }

  // ===== PAPERS CIENTÍFICOS =====
  static async createPaper(paperData: Partial<ScientificPaper>): Promise<string> {
    const docRef = await addDoc(collection(db, 'papers'), {
      ...paperData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async getPapers(userId: string): Promise<ScientificPaper[]> {
    const q = query(
      collection(db, 'papers'),
      where('ownerId', '==', userId),
      orderBy('publicationDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        publicationDate: data.publicationDate?.toDate ? data.publicationDate.toDate() : new Date(data.publicationDate),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      };
    }) as ScientificPaper[];
  }

  static async getPaper(paperId: string): Promise<ScientificPaper | null> {
    const docRef = doc(db, 'papers', paperId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ScientificPaper;
    }
    return null;
  }

  static async updatePaper(paperId: string, paperData: Partial<ScientificPaper>): Promise<void> {
    const docRef = doc(db, 'papers', paperId);
    await updateDoc(docRef, {
      ...paperData,
      updatedAt: serverTimestamp(),
    });
  }

  static async deletePaper(paperId: string): Promise<void> {
    const docRef = doc(db, 'papers', paperId);
    await deleteDoc(docRef);
  }

  static async searchPapersByTag(userId: string, tag: string): Promise<ScientificPaper[]> {
    const q = query(
      collection(db, 'papers'),
      where('ownerId', '==', userId),
      where('tags', 'array-contains', tag),
      orderBy('publicationDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ScientificPaper[];
  }

  // ===== COLABORACIONES =====
  static async createCollaboration(collaborationData: Partial<Collaboration>): Promise<string> {
    const docRef = await addDoc(collection(db, 'collaborations'), {
      ...collaborationData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async getCollaborations(userId: string): Promise<Collaboration[]> {
    const q = query(
      collection(db, 'collaborations'),
      where(`participants.${userId}`, '!=', null),
      orderBy('lastActivity', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Collaboration[];
  }

  // ===== MÉTRICAS Y ESTADÍSTICAS =====
  static async getDashboardStats(userId: string): Promise<DashboardStats> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Obtener conteos básicos
    const papersQuery = query(
      collection(db, 'papers'),
      where('ownerId', '==', userId)
    );
    
    const projectsQuery = query(
      collection(db, 'research_projects'),
      where('ownerId', '==', userId)
    );
    
    const collaborationsQuery = query(
      collection(db, 'collaborations'),
      where(`participants.${userId}`, '!=', null)
    );

    const [papersSnapshot, projectsSnapshot, collaborationsSnapshot] = await Promise.all([
      getDocs(papersQuery),
      getDocs(projectsQuery),
      getDocs(collaborationsQuery)
    ]);

    // Calcular papers del mes actual
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const papersThisMonth = papersSnapshot.docs.filter(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      return createdAt >= currentMonth;
    }).length;

    // Calcular colaboradores únicos en proyectos
    const allCollaborators = new Set<string>();
    projectsSnapshot.docs.forEach(doc => {
      const project = doc.data() as ResearchProject;
      if (project.collaborators && Array.isArray(project.collaborators)) {
        project.collaborators.forEach(collab => allCollaborators.add(collab));
      }
    });

    // Obtener actividad reciente (simplificado)
    const recentActivity: ActivityItem[] = [];

    return {
      totalPapers: papersSnapshot.size,
      totalProjects: projectsSnapshot.size,
      activeCollaborations: allCollaborators.size,
      papersThisMonth,
      recentActivity,
    };
  }

  static async updateMetrics(userId: string, metrics: Partial<ResearchMetrics>): Promise<void> {
    const docRef = doc(db, 'analytics', userId);
    await updateDoc(docRef, {
      ...metrics,
      lastUpdated: serverTimestamp(),
    });
  }

  // ===== BIBLIOTECA PERSONAL =====
  static async addToLibrary(userId: string, paperId: string): Promise<void> {
    const docRef = doc(db, 'user_library', userId, 'papers', paperId);
    await updateDoc(docRef, {
      addedAt: serverTimestamp(),
    });
  }

  static async getLibraryPapers(userId: string): Promise<ScientificPaper[]> {
    const q = query(
      collection(db, 'user_library', userId, 'papers'),
      orderBy('addedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ScientificPaper[];
  }

  // ===== FUNCIONES DE BÚSQUEDA =====
  static async searchPapers(userId: string, searchTerm: string): Promise<ScientificPaper[]> {
    // Búsqueda simple por título (Firestore no soporta búsqueda de texto completo)
    const q = query(
      collection(db, 'papers'),
      where('ownerId', '==', userId),
      orderBy('title')
    );
    
    const querySnapshot = await getDocs(q);
    const allPapers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ScientificPaper[];

    // Filtrar en el cliente (en producción usarías Algolia o similar)
    return allPapers.filter(paper => 
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.authors.some(author => 
        author.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      paper.tags.some(tag => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }
}
