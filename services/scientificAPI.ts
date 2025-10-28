// Servicios para integración con APIs científicas
import { CrossRefPaper, CrossRefResponse, PubMedPaper, PubMedResponse } from '@/types/scientific';

const CROSSREF_API_BASE = 'https://api.crossref.org/works';
const PUBMED_API_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const SEMANTIC_SCHOLAR_API_BASE = 'https://api.semanticscholar.org/graph/v1/paper/search';
const OPENALEX_API_BASE = 'https://api.openalex.org/works';

export class ScientificAPIService {
  // Helper: Limpiar DOI (acepta URL completa o solo código)
  private static cleanDOI(doi: string): string {
    // Eliminar espacios
    doi = doi.trim();
    
    // Si es una URL completa, extraer solo el código DOI
    if (doi.startsWith('http://') || doi.startsWith('https://')) {
      // Ejemplos:
      // https://doi.org/10.5281/zenodo.15150726 → 10.5281/zenodo.15150726
      // http://dx.doi.org/10.1038/nature12373 → 10.1038/nature12373
      const match = doi.match(/10\.\d{4,}(?:\.\d+)*\/\S+/);
      if (match) {
        return match[0];
      }
    }
    
    // Si ya es solo el código DOI, devolverlo tal cual
    return doi;
  }

  // CrossRef API - Para obtener metadatos de papers por DOI
  static async getPaperByDOI(doi: string): Promise<CrossRefPaper | null> {
    try {
      // Limpiar el DOI antes de usar
      const cleanedDOI = this.cleanDOI(doi);
      
      const response = await fetch(`${CROSSREF_API_BASE}/${cleanedDOI}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`CrossRef API error: ${response.status}`);
      }

      const data: CrossRefResponse = await response.json();
      return data.message.items?.[0] || null;
    } catch (error) {
      console.error('Error fetching paper from CrossRef:', error);
      return null;
    }
  }

  // CrossRef API - Búsqueda de papers por términos (alias)
  static async searchCrossRef(query: string, limit: number = 10): Promise<CrossRefPaper[]> {
    return this.searchPapers(query, limit);
  }

  // CrossRef API - Búsqueda de papers por términos
  static async searchPapers(query: string, limit: number = 10): Promise<CrossRefPaper[]> {
    try {
      const params = new URLSearchParams({
        query,
        rows: limit.toString(),
        sort: 'published',
        order: 'desc',
      });

      const response = await fetch(`${CROSSREF_API_BASE}?${params}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`CrossRef API error: ${response.status}`);
      }

      const data: CrossRefResponse = await response.json();
      return data.message.items || [];
    } catch (error) {
      console.error('Error searching papers in CrossRef:', error);
      return [];
    }
  }

  // PubMed API - Búsqueda de papers biomédicos
  static async searchPubMedPapers(query: string, limit: number = 10): Promise<PubMedPaper[]> {
    try {
      // Paso 1: Buscar IDs
      const searchParams = new URLSearchParams({
        db: 'pubmed',
        term: query,
        retmax: limit.toString(),
        retmode: 'json',
        sort: 'relevance',
      });

      const searchResponse = await fetch(`${PUBMED_API_BASE}/esearch.fcgi?${searchParams}`);
      
      if (!searchResponse.ok) {
        throw new Error(`PubMed search error: ${searchResponse.status}`);
      }

      const searchData: PubMedResponse = await searchResponse.json();
      
      if (!searchData.esearchresult.idlist.length) {
        return [];
      }

      // Paso 2: Obtener detalles de los papers
      const ids = searchData.esearchresult.idlist.join(',');
      const fetchParams = new URLSearchParams({
        db: 'pubmed',
        id: ids,
        retmode: 'xml',
        rettype: 'abstract',
      });

      const fetchResponse = await fetch(`${PUBMED_API_BASE}/efetch.fcgi?${fetchParams}`);
      
      if (!fetchResponse.ok) {
        throw new Error(`PubMed fetch error: ${fetchResponse.status}`);
      }

      const xmlText = await fetchResponse.text();
      return this.parsePubMedXML(xmlText);
    } catch (error) {
      console.error('Error searching papers in PubMed:', error);
      return [];
    }
  }

  // Parsear XML de PubMed (simplificado)
  private static parsePubMedXML(xmlText: string): PubMedPaper[] {
    // Esta es una implementación simplificada
    // En producción, usarías una librería como xml2js
    const papers: PubMedPaper[] = [];
    
    // Regex básico para extraer información (simplificado)
    const articleMatches = xmlText.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g);
    
    if (articleMatches) {
      articleMatches.forEach(article => {
        const pmidMatch = article.match(/<PMID[^>]*>(\d+)<\/PMID>/);
        const titleMatch = article.match(/<ArticleTitle[^>]*>([^<]+)<\/ArticleTitle>/);
        const journalMatch = article.match(/<Title[^>]*>([^<]+)<\/Title>/);
        
        if (pmidMatch && titleMatch) {
          papers.push({
            uid: pmidMatch[1],
            pmid: pmidMatch[1],
            title: titleMatch[1],
            authors: [], // Simplificado
            journal: journalMatch?.[1] || 'Unknown',
            pubdate: new Date().toISOString(),
            url: `https://pubmed.ncbi.nlm.nih.gov/${pmidMatch[1]}/`,
          });
        }
      });
    }
    
    return papers;
  }

  // ArXiv API - Búsqueda de preprints
  static async searchArXivPapers(query: string, limit: number = 10): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        search_query: query,
        max_results: limit.toString(),
        sortBy: 'submittedDate',
        sortOrder: 'descending',
      });

      const response = await fetch(`http://export.arxiv.org/api/query?${params}`);
      
      if (!response.ok) {
        throw new Error(`ArXiv API error: ${response.status}`);
      }

      const xmlText = await response.text();
      return this.parseArXivXML(xmlText);
    } catch (error) {
      console.error('Error searching papers in ArXiv:', error);
      return [];
    }
  }

  // Parsear XML de ArXiv (simplificado)
  private static parseArXivXML(xmlText: string): any[] {
    const papers: any[] = [];
    
    // Regex básico para extraer información (simplificado)
    const entryMatches = xmlText.match(/<entry>[\s\S]*?<\/entry>/g);
    
    if (entryMatches) {
      entryMatches.forEach(entry => {
        const idMatch = entry.match(/<id[^>]*>([^<]+)<\/id>/);
        const titleMatch = entry.match(/<title[^>]*>([^<]+)<\/title>/);
        const summaryMatch = entry.match(/<summary[^>]*>([^<]+)<\/summary>/);
        
        if (idMatch && titleMatch) {
          papers.push({
            arxivId: idMatch[1].split('/').pop(),
            title: titleMatch[1],
            abstract: summaryMatch?.[1] || '',
            url: idMatch[1],
            publicationDate: new Date().toISOString(),
          });
        }
      });
    }
    
    return papers;
  }

  // Función helper para normalizar datos de diferentes APIs
  static normalizePaperData(apiData: any, source: 'crossref' | 'pubmed' | 'arxiv' | 'semantic' | 'openalex'): any {
    switch (source) {
      case 'crossref':
        return {
          title: apiData.title?.[0] || '',
          authors: apiData.author?.map((a: any) => `${a.given} ${a.family}`) || [],
          abstract: apiData.abstract || '',
          doi: apiData.DOI,
          journal: apiData['container-title']?.[0] || '',
          publicationDate: apiData['published-print']?.['date-parts']?.[0]?.join('-') || 
                          apiData['published-online']?.['date-parts']?.[0]?.join('-') || '',
          url: apiData.URL,
          citations: apiData['is-referenced-by-count'] || 0,
        };
      
      case 'pubmed':
        return {
          title: apiData.title,
          authors: apiData.authors,
          abstract: apiData.abstract || '',
          pmid: apiData.pmid,
          journal: apiData.journal,
          publicationDate: apiData.pubdate,
          url: apiData.url,
        };
      
      case 'arxiv':
        return {
          title: apiData.title,
          abstract: apiData.abstract,
          authors: apiData.authors || [],
          arxivId: apiData.arxivId,
          publicationDate: apiData.publicationDate,
          url: apiData.url,
        };
      
      case 'semantic':
        return {
          title: apiData.title || '',
          abstract: apiData.abstract || '',
          authors: typeof apiData.authors === 'string' ? apiData.authors.split(', ') : [],
          year: apiData.year || new Date().getFullYear(),
          citations: apiData.citations || 0,
          url: apiData.url,
          venue: apiData.venue || '',
          doi: apiData.doi || '',
        };
      
      case 'openalex':
        return {
          title: apiData.title || '',
          abstract: apiData.abstract || '',
          authors: typeof apiData.authors === 'string' ? apiData.authors.split(', ') : [],
          year: apiData.year || new Date().getFullYear(),
          citations: apiData.citations || 0,
          url: apiData.url,
          venue: apiData.venue || '',
          doi: apiData.doi,
        };
      
      default:
        return apiData;
    }
  }

  // arXiv API - Search for papers on arXiv
  static async searchArXiv(query: string, maxResults: number = 10): Promise<any[]> {
    try {
      const response = await fetch(`https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=${maxResults}`, {
        headers: {
          'Accept': 'application/atom+xml',
        },
      });

      if (!response.ok) {
        throw new Error(`arXiv API error: ${response.status}`);
      }

      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

      const entries = Array.from(xmlDoc.getElementsByTagName('entry'));
      const papers = entries.map(entry => {
        const title = entry.getElementsByTagName('title')[0]?.textContent || '';
        const summary = entry.getElementsByTagName('summary')[0]?.textContent || '';
        const authors = Array.from(entry.getElementsByTagName('author')).map(auth => auth.getElementsByTagName('name')[0]?.textContent || '').filter(Boolean);
        const published = entry.getElementsByTagName('published')[0]?.textContent || '';
        const id = entry.getElementsByTagName('id')[0]?.textContent || '';
        const arxivId = id.split('/').pop() || '';

        return {
          title: title.replace(/\s+/g, ' ').trim(),
          abstract: summary.trim(),
          authors,
          arxivId,
          publicationDate: published,
          url: id,
        };
      });

      return papers;
    } catch (error) {
      console.error('Error fetching papers from arXiv:', error);
      return [];
    }
  }

  // CrossRef API - Search for papers by title
  static async searchByTitle(title: string, maxResults: number = 10): Promise<CrossRefPaper[]> {
    try {
      const response = await fetch(`${CROSSREF_API_BASE}?query.title=${encodeURIComponent(title)}&rows=${maxResults}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`CrossRef API error: ${response.status}`);
      }

      const data: CrossRefResponse = await response.json();
      return data.message.items || [];
    } catch (error) {
      console.error('Error searching papers from CrossRef:', error);
      return [];
    }
  }

  // Semantic Scholar API - Search for papers
  static async searchSemanticScholar(query: string, maxResults: number = 10): Promise<any[]> {
    try {
      const response = await fetch(
        `${SEMANTIC_SCHOLAR_API_BASE}?query=${encodeURIComponent(query)}&limit=${maxResults}&fields=title,authors,abstract,year,citationCount,url,venue,externalIds`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Semantic Scholar API error: ${response.status}`);
      }

      const data = await response.json();
      
      return (data.data || []).map((paper: any) => ({
        title: paper.title || '',
        abstract: paper.abstract || '',
        authors: paper.authors?.map((a: any) => a.name).join(', ') || '',
        year: paper.year || new Date().getFullYear(),
        citations: paper.citationCount || 0,
        url: paper.url,
        venue: paper.venue || '',
        doi: paper.externalIds?.DOI || '',
      }));
    } catch (error) {
      console.error('Error searching papers from Semantic Scholar:', error);
      return [];
    }
  }

  // OpenAlex API - Search for papers
  static async searchOpenAlex(query: string, maxResults: number = 10): Promise<any[]> {
    try {
      const response = await fetch(
        `${OPENALEX_API_BASE}?search=${encodeURIComponent(query)}&per_page=${maxResults}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`OpenAlex API error: ${response.status}`);
      }

      const data = await response.json();
      
      return (data.results || []).map((paper: any) => ({
        title: paper.title || '',
        abstract: paper.abstract || '',
        authors: paper.authorships?.map((a: any) => a.author?.display_name).filter(Boolean).join(', ') || '',
        year: paper.publication_year || new Date().getFullYear(),
        citations: paper.cited_by_count || 0,
        url: paper.doi || paper.primary_location?.landing_page_url,
        venue: paper.primary_location?.source?.display_name || '',
        doi: paper.doi,
      }));
    } catch (error) {
      console.error('Error searching papers from OpenAlex:', error);
      return [];
    }
  }
}
