// Tipos para el sistema científico
export interface User {
  id: string;
  email: string;
  name: string;
  affiliation?: string;
  orcidId?: string;
  googleScholarId?: string;
  researchInterests: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  completedAt?: Date;
}

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  collaborators: string[];
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  startDate: Date;
  endDate?: Date;
  tags: string[];
  milestones?: ProjectMilestone[];
  progress?: number; // 0-100 percentage
  createdAt: Date;
  updatedAt: Date;
}

export interface ScientificPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  doi?: string;
  pmid?: string;
  arxivId?: string;
  journal?: string;
  publicationDate: Date;
  url?: string;
  pdfUrl?: string;
  tags: string[];
  citations?: number;
  impactFactor?: number;
  ownerId: string;
  projectId?: string;
  isRead: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Collaboration {
  id: string;
  projectId: string;
  participants: Record<string, {
    userId: string;
    role: 'owner' | 'collaborator' | 'reviewer';
    joinedAt: Date;
  }>;
  lastActivity: Date;
  messages: CollaborationMessage[];
  createdAt: Date;
}

export interface CollaborationMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'comment' | 'system';
}

export interface ResearchMetrics {
  userId: string;
  totalPapers: number;
  totalProjects: number;
  totalCollaborations: number;
  papersThisYear: number;
  citationsThisYear: number;
  hIndex?: number;
  lastUpdated: Date;
}

// Tipos para APIs externas
export interface CrossRefResponse {
  status: string;
  'message-type': string;
  'message-version': string;
  message: {
    'total-results': number;
    items: CrossRefPaper[];
  };
}

export interface CrossRefPaper {
  DOI: string;
  title: string[];
  author: Array<{
    given: string;
    family: string;
    ORCID?: string;
  }>;
  'abstract': string;
  'published-print'?: {
    'date-parts': number[][];
  };
  'published-online'?: {
    'date-parts': number[][];
  };
  'container-title': string[];
  'reference-count': number;
  'is-referenced-by-count': number;
  URL: string;
}

export interface PubMedResponse {
  esearchresult: {
    count: string;
    retmax: string;
    retstart: string;
    idlist: string[];
  };
}

export interface PubMedPaper {
  uid: string;
  title: string;
  authors: string[];
  abstract?: string;
  journal: string;
  pubdate: string;
  doi?: string;
  pmid: string;
  url: string;
}

export interface ArxivPaper {
  arxivId: string;
  title: string;
  authors: string[];
  abstract: string;
  publicationDate: string;
  url: string;
}

// Tipos para el dashboard
export interface DashboardStats {
  totalPapers: number;
  totalProjects: number;
  activeCollaborations: number;
  papersThisMonth: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'paper_added' | 'project_created' | 'collaboration_started' | 'paper_read';
  title: string;
  description: string;
  timestamp: Date;
  userId: string;
}

// Tipos para formularios
export interface PaperFormData {
  title: string;
  authors: string[];
  abstract: string;
  doi?: string;
  pmid?: string;
  arxivId?: string;
  journal?: string;
  publicationDate: string;
  url?: string;
  pdfUrl?: string;
  tags: string[];
  projectId?: string;
  notes?: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  collaborators: string[];
  startDate: string;
  endDate?: string;
  tags: string[];
  milestones?: ProjectMilestone[];
  progress?: number;
}
