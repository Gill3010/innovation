/**
 * Paper Search Service - Reemplaza la Cloud Function searchExternalPapers
 * Plan Spark compatible - Llama directamente a APIs públicas desde el frontend
 */

export interface PaperResult {
  title: string;
  authors: string[];
  abstract?: string;
  journal?: string;
  publicationDate?: string;
  doi?: string;
  url?: string;
  citationCount?: number;
}

/**
 * Busca papers en CrossRef API
 * @param query - Término de búsqueda
 * @param rows - Número de resultados (default: 10)
 * @returns Lista de papers
 */
export async function searchCrossRef(query: string, rows: number = 10): Promise<PaperResult[]> {
  try {
    const response = await fetch(
      `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=${rows}`
    );

    if (!response.ok) {
      throw new Error(`CrossRef API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.message.items.map((item: any) => ({
      title: item.title?.[0] || 'No title',
      authors: item.author?.map((a: any) => 
        `${a.given || ''} ${a.family || ''}`.trim()
      ) || [],
      abstract: item.abstract,
      journal: item['container-title']?.[0],
      publicationDate: item.published?.['date-parts']?.[0]?.join('-'),
      doi: item.DOI,
      url: item.URL,
      citationCount: item['is-referenced-by-count'],
    }));
  } catch (error) {
    console.error('Error searching CrossRef:', error);
    throw new Error('Failed to search CrossRef');
  }
}

/**
 * Busca papers en Semantic Scholar API
 * @param query - Término de búsqueda
 * @param limit - Número de resultados (default: 10)
 * @returns Lista de papers
 */
export async function searchSemanticScholar(query: string, limit: number = 10): Promise<PaperResult[]> {
  try {
    const response = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=${limit}&fields=title,authors,abstract,year,venue,citationCount,externalIds,url`
    );

    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.data.map((item: any) => ({
      title: item.title || 'No title',
      authors: item.authors?.map((a: any) => a.name) || [],
      abstract: item.abstract,
      journal: item.venue,
      publicationDate: item.year?.toString(),
      doi: item.externalIds?.DOI,
      url: item.url,
      citationCount: item.citationCount,
    }));
  } catch (error) {
    console.error('Error searching Semantic Scholar:', error);
    throw new Error('Failed to search Semantic Scholar');
  }
}

/**
 * Busca papers en arXiv API
 * @param query - Término de búsqueda
 * @param maxResults - Número de resultados (default: 10)
 * @returns Lista de papers
 */
export async function searchArXiv(query: string, maxResults: number = 10): Promise<PaperResult[]> {
  try {
    const response = await fetch(
      `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=${maxResults}`
    );

    if (!response.ok) {
      throw new Error(`arXiv API error: ${response.status}`);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const entries = xmlDoc.getElementsByTagName('entry');

    const results: PaperResult[] = [];
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      
      const title = entry.getElementsByTagName('title')[0]?.textContent?.trim() || 'No title';
      
      const authors: string[] = [];
      const authorElements = entry.getElementsByTagName('author');
      for (let j = 0; j < authorElements.length; j++) {
        const name = authorElements[j].getElementsByTagName('name')[0]?.textContent?.trim();
        if (name) authors.push(name);
      }
      
      const abstract = entry.getElementsByTagName('summary')[0]?.textContent?.trim();
      const published = entry.getElementsByTagName('published')[0]?.textContent?.trim();
      const url = entry.getElementsByTagName('id')[0]?.textContent?.trim();

      results.push({
        title,
        authors,
        abstract,
        publicationDate: published,
        url,
      });
    }

    return results;
  } catch (error) {
    console.error('Error searching arXiv:', error);
    throw new Error('Failed to search arXiv');
  }
}

/**
 * Busca papers por DOI
 * @param doi - DOI del paper
 * @returns Información del paper
 */
export async function searchByDOI(doi: string): Promise<PaperResult | null> {
  try {
    const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const item = data.message;

    return {
      title: item.title?.[0] || 'No title',
      authors: item.author?.map((a: any) => 
        `${a.given || ''} ${a.family || ''}`.trim()
      ) || [],
      abstract: item.abstract,
      journal: item['container-title']?.[0],
      publicationDate: item.published?.['date-parts']?.[0]?.join('-'),
      doi: item.DOI,
      url: item.URL,
      citationCount: item['is-referenced-by-count'],
    };
  } catch (error) {
    console.error('Error searching by DOI:', error);
    return null;
  }
}

/**
 * Busca en múltiples fuentes en paralelo
 * @param query - Término de búsqueda
 * @returns Resultados agregados de todas las fuentes
 */
export async function searchAllSources(query: string): Promise<{
  crossref: PaperResult[];
  semanticScholar: PaperResult[];
  arxiv: PaperResult[];
}> {
  const [crossref, semanticScholar, arxiv] = await Promise.allSettled([
    searchCrossRef(query, 5),
    searchSemanticScholar(query, 5),
    searchArXiv(query, 5),
  ]);

  return {
    crossref: crossref.status === 'fulfilled' ? crossref.value : [],
    semanticScholar: semanticScholar.status === 'fulfilled' ? semanticScholar.value : [],
    arxiv: arxiv.status === 'fulfilled' ? arxiv.value : [],
  };
}


