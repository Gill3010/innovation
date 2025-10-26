// Servicio para integración con OJS (Open Journal Systems) API
// Documentación OJS: https://docs.pkp.sfu.ca/dev/

export interface OJSSubmissionData {
  title: string;
  authors: string[];
  abstract: string;
  keywords?: string[];
  sections?: string[];
  locale?: string;
}

export interface OJSSubmissionResponse {
  success: boolean;
  submissionId?: string;
  message?: string;
  error?: string;
}

export class OJSAPIService {
  // URL base de la instalación OJS
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_OJS_BASE_URL || 'https://relaticpanama.org/_journals';
  
  // URL de la API (puede variar según versión de OJS)
  private static readonly API_ENDPOINT = `${this.BASE_URL}/index.php/api/v1/submissions`;
  
  // Credenciales - deben estar en variables de entorno
  private static readonly API_KEY = process.env.NEXT_PUBLIC_OJS_API_KEY;
  private static readonly API_SECRET = process.env.NEXT_PUBLIC_OJS_API_SECRET;

  /**
   * Verifica si las credenciales están configuradas
   */
  static hasCredentials(): boolean {
    return !!(this.API_KEY && this.API_SECRET);
  }

  /**
   * Verifica la autenticación con OJS
   */
  static async checkConnection(): Promise<boolean> {
    if (!this.hasCredentials()) {
      return false;
    }

    try {
      const response = await fetch(`${this.BASE_URL}/api/v1/submissions`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return response.ok || response.status === 401; // 401 indica que la API existe pero requiere auth
    } catch (error) {
      console.error('Error checking OJS connection:', error);
      return false;
    }
  }

  /**
   * Obtiene las secciones disponibles en la revista
   * Esto ayuda a verificar que la API está funcionando
   */
  static async getSections(): Promise<any[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/api/v1/sections`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`OJS API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching sections:', error);
      return [];
    }
  }

  /**
   * Envía un paper a OJS
   */
  static async submitPaper(paperData: OJSSubmissionData): Promise<OJSSubmissionResponse> {
    if (!this.API_KEY || !this.API_SECRET) {
      return {
        success: false,
        error: 'OJS API credentials not configured. Please set NEXT_PUBLIC_OJS_API_KEY and NEXT_PUBLIC_OJS_API_SECRET environment variables.'
      };
    }

    try {
      // Preparar el payload según el formato esperado por OJS
      const payload = {
        title: paperData.title,
        abstract: paperData.abstract,
        keywords: paperData.keywords || [],
        sections: paperData.sections || [],
        locale: paperData.locale || 'en_US',
        // Datos de autor(es)
        authors: paperData.authors.map((author, index) => ({
          firstName: this.extractFirstName(author),
          lastName: this.extractLastName(author),
          email: '', // Se puede agregar después
          affiliation: '',
          country: '',
          orcid: '',
          userGroupId: 14, // ID del grupo de autores (14 es el default en OJS)
          primaryContact: index === 0, // Primer autor como contacto principal
        })),
      };

      console.log('Submitting paper to OJS:', payload);

      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        return {
          success: true,
          submissionId: responseData.data?.id,
          message: 'Paper submitted successfully to OJS',
        };
      } else {
        return {
          success: false,
          error: responseData.message || `OJS API error: ${response.status}`,
        };
      }
    } catch (error) {
      console.error('Error submitting paper to OJS:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Obtiene las cabeceras de autenticación
   */
  private static getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Si hay credenciales, agregar autenticación
    if (this.API_KEY && this.API_SECRET) {
      // OJS usa HTTP Basic Auth con API Key y Secret
      const credentials = btoa(`${this.API_KEY}:${this.API_SECRET}`);
      headers['Authorization'] = `Basic ${credentials}`;
    }

    return headers;
  }

  /**
   * Extrae el primer nombre de un nombre completo
   */
  private static extractFirstName(fullName: string): string {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0];
    return parts.slice(0, -1).join(' ');
  }

  /**
   * Extrae el apellido de un nombre completo
   */
  private static extractLastName(fullName: string): string {
    const parts = fullName.trim().split(' ');
    return parts[parts.length - 1] || '';
  }

  /**
   * Convierte un paper de nuestro formato a formato OJS
   */
  static convertToOJSFormat(paper: any): OJSSubmissionData {
    return {
      title: paper.title,
      authors: paper.authors,
      abstract: paper.abstract || '',
      keywords: paper.tags || [],
      sections: ['Articles'], // Sección por defecto
      locale: 'en_US',
    };
  }
}
