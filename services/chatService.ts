// Chat service for the scientific research assistant chatbot
import { ScientificDataService } from './scientificData';
import { ScientificAPIService } from './scientificAPI';
import { ScientificPaper, ResearchProject } from '@/types/scientific';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class ChatService {
  private static readonly API_ENDPOINT = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
  private static readonly FALLBACK_ENDPOINTS = [
    'https://api-inference.huggingface.co/models/google/flan-t5-base',
    'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
  ];

  // Generate response using Hugging Face Inference API (free tier)
  static async getResponse(userMessage: string, conversationHistory: ChatMessage[], userId?: string): Promise<string> {
    try {
      // First try contextual response if it's about user's data
      const contextualResponse = userId ? await this.processContextualMessage(userMessage, userId) : null;
      if (contextualResponse) return contextualResponse;

      // Create a context-aware prompt focused on scientific and academic topics
      const context = this.buildScientificContext(conversationHistory);
      const prompt = `${context}\nUser: ${userMessage}\nAssistant:`;

      // Try primary endpoint
      const response = await this.tryEndpoint(this.API_ENDPOINT, userMessage);
      if (response) return response;

      // Try fallback endpoints
      for (const endpoint of this.FALLBACK_ENDPOINTS) {
        const fallbackResponse = await this.tryEndpoint(endpoint, userMessage);
        if (fallbackResponse) return fallbackResponse;
      }

      // If all APIs fail, return intelligent fallback
      return this.getFallbackResponse(userMessage, userId);
    } catch (error) {
      console.error('Error in chat service:', error);
      return this.getFallbackResponse(userMessage, userId);
    }
  }

  // Process contextual messages about user's papers and projects
  private static async processContextualMessage(message: string, userId: string): Promise<string | null> {
    const lowerMessage = message.toLowerCase();

    try {
      // Search for papers
      if (lowerMessage.includes('paper') || lowerMessage.includes('publication') || lowerMessage.includes('article')) {
        const papers = await ScientificDataService.getPapers(userId);
        const searchTerm = message.replace(/papers?|publications?|articles?/gi, '').replace(/show me my/gi, '').trim();
        
        // If no search term, return all papers
        if (!searchTerm) {
          if (papers.length === 0) {
            return `You don't have any papers yet. Add papers to your library to get started!`;
          }
          
          const papersList = papers.slice(0, 5).map(p => 
            `- "${p.title}" by ${p.authors.join(', ')} (${new Date(p.publicationDate).getFullYear()})`
          ).join('\n');

          const moreText = papers.length > 5 ? `\n\n...and ${papers.length - 5} more papers.` : '';
          return `You have ${papers.length} paper(s) in your library:\n\n${papersList}${moreText}`;
        }

        // If search term exists, filter papers
        const filtered = papers.filter(p => 
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        if (filtered.length === 0) {
          return `I couldn't find any papers matching "${searchTerm}". You currently have ${papers.length} paper(s) in your library.`;
        }

        const papersList = filtered.slice(0, 3).map(p => 
          `- "${p.title}" by ${p.authors.join(', ')} (${new Date(p.publicationDate).getFullYear()})`
        ).join('\n');

        const moreText = filtered.length > 3 ? `\n\n...and ${filtered.length - 3} more papers.` : '';
        return `I found ${filtered.length} paper(s) related to "${searchTerm}":\n\n${papersList}${moreText}`;
      }

      // Search for projects
      if (lowerMessage.includes('project') || lowerMessage.includes('research hub')) {
        const projects = await ScientificDataService.getProjects(userId);
        const searchTerm = message.replace(/projects?|research hub|what|do i have/gi, '').trim();
        
        // If no search term, return all projects
        if (!searchTerm) {
          if (projects.length === 0) {
            return `You don't have any projects yet. Create projects to get started!`;
          }
          
          const projectsList = projects.slice(0, 5).map(p => 
            `- "${p.title}" - Status: ${p.status}, Progress: ${p.progress || 0}%`
          ).join('\n');

          const moreText = projects.length > 5 ? `\n\n...and ${projects.length - 5} more projects.` : '';
          return `You have ${projects.length} project(s):\n\n${projectsList}${moreText}`;
        }

        // If search term exists, filter projects
        const filtered = projects.filter(p => 
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filtered.length === 0) {
          return `I couldn't find any projects matching "${searchTerm}". You currently have ${projects.length} project(s).`;
        }

        const projectsList = filtered.slice(0, 3).map(p => 
          `- "${p.title}" - Status: ${p.status}, Progress: ${p.progress || 0}%`
        ).join('\n');

        const moreText = filtered.length > 3 ? `\n\n...and ${filtered.length - 3} more projects.` : '';
        return `I found ${filtered.length} project(s) related to "${searchTerm}":\n\n${projectsList}${moreText}`;
      }

      // General stats
      if (lowerMessage.includes('stats') || lowerMessage.includes('statistics') || lowerMessage.includes('summary')) {
        const [papers, projects] = await Promise.all([
          ScientificDataService.getPapers(userId),
          ScientificDataService.getProjects(userId)
        ]);

        const readPapers = papers.filter(p => p.isRead).length;
        const activeProjects = projects.filter(p => p.status === 'active').length;
        const completedProjects = projects.filter(p => p.status === 'completed').length;

        return `Here's your research summary:\n\n📄 Papers: ${papers.length} total (${readPapers} read)\n📁 Projects: ${projects.length} total (${activeProjects} active, ${completedProjects} completed)\n\nWould you like to know more about your papers or projects?`;
      }

      // Search by tags
      if (lowerMessage.includes('tag') && (lowerMessage.includes('paper') || lowerMessage.includes('project'))) {
        const [papers, projects] = await Promise.all([
          ScientificDataService.getPapers(userId),
          ScientificDataService.getProjects(userId)
        ]);

        // Extract potential tag from message
        const tagMatch = message.match(/tag[:\s]+([\w\s]+)/i) || message.match(/with[:\s]+([\w\s]+)[:\s]+tag/i);
        const searchTag = tagMatch ? tagMatch[1].trim() : '';

        if (searchTag) {
          const taggedPapers = papers.filter(p => p.tags.some(t => t.toLowerCase().includes(searchTag.toLowerCase())));
          const taggedProjects = projects.filter(p => p.tags.some(t => t.toLowerCase().includes(searchTag.toLowerCase())));

          if (taggedPapers.length === 0 && taggedProjects.length === 0) {
            return `I couldn't find any papers or projects with the tag "${searchTag}".`;
          }

          let result = `Found ${taggedPapers.length} paper(s) and ${taggedProjects.length} project(s) with tag "${searchTag}":\n\n`;
          
          if (taggedPapers.length > 0) {
            result += `📄 Papers:\n${taggedPapers.slice(0, 3).map(p => `- ${p.title}`).join('\n')}`;
            if (taggedPapers.length > 3) result += `\n...and ${taggedPapers.length - 3} more.`;
          }
          
          if (taggedProjects.length > 0) {
            result += `\n\n📁 Projects:\n${taggedProjects.slice(0, 3).map(p => `- ${p.title} (${p.status})`).join('\n')}`;
            if (taggedProjects.length > 3) result += `\n...and ${taggedProjects.length - 3} more.`;
          }

          return result;
        }
      }

      // Help with detailed capabilities
      if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
        const [papers, projects] = await Promise.all([
          ScientificDataService.getPapers(userId),
          ScientificDataService.getProjects(userId)
        ]);

        return `I can help you with your research! Here's what I can do:\n\n📄 Your Papers (${papers.length} in library):\n• "Show me my papers" - List all your papers\n• "Find papers about [topic]" - Search by topic\n• "Show unread papers" - Papers you haven't read\n• "Show papers with tag [name]" - Filter by tags\n\n📁 Your Projects (${projects.length} total):\n• "What projects do I have?" - List your projects\n• "Show my active projects" - Filter by status\n• "Show projects with tag [name]" - Filter by tags\n\n🔍 Search Public Databases:\n• "Search CrossRef [topic]" - Published papers\n• "arxiv [topic]" - Preprints\n• "semantic scholar [topic]" - AI/ML papers\n• "openalex [topic]" - Comprehensive search\n• "help search" - Search commands help\n\n📊 Statistics:\n• "Show statistics" - Overview of your research\n\n💡 Just ask me anything!`;
      }

      // Search for unread papers
      if (lowerMessage.includes('unread')) {
        const papers = await ScientificDataService.getPapers(userId);
        const unreadPapers = papers.filter(p => !p.isRead);

        if (unreadPapers.length === 0) {
          return `Great! You've read all your papers (${papers.length} total).`;
        }

        const unreadList = unreadPapers.slice(0, 5).map(p => 
          `- ${p.title} by ${p.authors[0]} (${new Date(p.publicationDate).getFullYear()})`
        ).join('\n');

        const moreText = unreadPapers.length > 5 ? `\n\n...and ${unreadPapers.length - 5} more papers waiting.` : '';
        return `You have ${unreadPapers.length} unread paper(s):\n\n${unreadList}${moreText}`;
      }

      // Search public databases for papers
      if (lowerMessage.includes('search for') || lowerMessage.includes('find papers about')) {
        const searchTerm = message.replace(/search for|find papers about/gi, '').trim();
        
        if (searchTerm) {
          return `Searching public databases for "${searchTerm}"...\n\nI can search through:\n• CrossRef - Published papers\n• arXiv - Preprints\n• Semantic Scholar - AI/ML papers\n• OpenAlex - Comprehensive database\n\nWould you like me to search one specific database or try all of them?`;
        }
      }

      // Search CrossRef specifically
      if (lowerMessage.includes('search crossref') || lowerMessage.includes('crossref')) {
        const searchTerm = message.replace(/search crossref|crossref/gi, '').trim();
        
        if (searchTerm) {
          try {
            const results = await ScientificAPIService.searchCrossRef(searchTerm, 5);
            
            if (results.length === 0) {
              return `I couldn't find any papers on CrossRef matching "${searchTerm}". Try a different search term or check the spelling.`;
            }
  
            const resultsList = results.map((p, i) => {
              const authors = p.author?.slice(0, 3).map(a => `${a.given || ''} ${a.family || ''}`.trim()).join(', ') || 'Unknown';
              const year = p['published-print']?.['date-parts']?.[0]?.[0] || p['published-online']?.['date-parts']?.[0]?.[0] || '';
              return `${i + 1}. "${p.title?.[0] || 'Untitled'}"\n   By ${authors} (${year})`;
            }).join('\n\n');

            return `Found ${results.length} paper(s) on CrossRef for "${searchTerm}":\n\n${resultsList}`;
          } catch (error) {
            return `I encountered an error searching CrossRef. Please try again or use a different search term.`;
          }
        }
      }

      // Search arXiv
      if (lowerMessage.includes('arxiv') && !lowerMessage.includes('search')) {
        const searchTerm = message.replace(/arxiv/gi, '').trim();
        
        if (searchTerm) {
          try {
            const results = await ScientificAPIService.searchArXiv(searchTerm, 5);
            
            if (results.length === 0) {
              return `I couldn't find any papers on arXiv matching "${searchTerm}".`;
            }

            const resultsList = results.map((p, i) => 
              `${i + 1}. "${p.title}" by ${p.authors.join(', ')} (${p.publicationDate.substring(0, 4)})`
            ).join('\n\n');

            return `Found ${results.length} paper(s) on arXiv for "${searchTerm}":\n\n${resultsList}`;
          } catch (error) {
            return `I encountered an error searching arXiv. Please try again.`;
          }
        }
      }

      // Search Semantic Scholar
      if (lowerMessage.includes('semantic scholar') || lowerMessage.includes('semantic')) {
        const searchTerm = message.replace(/semantic scholar|semantic/gi, '').trim();
        
        if (searchTerm) {
          try {
            const results = await ScientificAPIService.searchSemanticScholar(searchTerm, 5);
            
            if (results.length === 0) {
              return `I couldn't find any papers on Semantic Scholar matching "${searchTerm}".`;
            }

            const resultsList = results.map((p, i) => 
              `${i + 1}. "${p.title}"\n   By ${p.authors} (${p.year}) - ${p.citations} citations`
            ).join('\n\n');

            return `Found ${results.length} paper(s) on Semantic Scholar for "${searchTerm}":\n\n${resultsList}`;
          } catch (error) {
            return `I encountered an error searching Semantic Scholar. Please try again.`;
          }
        }
      }

      // Search OpenAlex
      if (lowerMessage.includes('openalex') || lowerMessage.includes('open alex')) {
        const searchTerm = message.replace(/openalex|open alex/gi, '').trim();
        
        if (searchTerm) {
          try {
            const results = await ScientificAPIService.searchOpenAlex(searchTerm, 5);
            
            if (results.length === 0) {
              return `I couldn't find any papers on OpenAlex matching "${searchTerm}".`;
            }

            const resultsList = results.map((p, i) => 
              `${i + 1}. "${p.title}"\n   By ${p.authors} (${p.year}) - ${p.citations} citations\n   ${p.venue || ''}`
            ).join('\n\n');

            return `Found ${results.length} paper(s) on OpenAlex for "${searchTerm}":\n\n${resultsList}`;
          } catch (error) {
            return `I encountered an error searching OpenAlex. Please try again.`;
          }
        }
      }

      // Help command - Update to include new search capabilities
      if (lowerMessage.includes('help search') || lowerMessage.includes('search help')) {
        return `I can search these academic databases:\n\n🔍 Search Commands:\n• "Search CrossRef [topic]" - Published papers\n• "arxiv [topic]" - Preprints\n• "semantic scholar [topic]" - AI/ML papers\n• "openalex [topic]" - Comprehensive search\n\n📚 Example:\n"Search CrossRef machine learning"\n"arxiv neural networks"\n"semantic scholar transformers"`;
      }
    } catch (error) {
      console.error('Error processing contextual message:', error);
    }

    return null;
  }

  // Try a specific endpoint
  private static async tryEndpoint(endpoint: string, message: string): Promise<string | null> {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: message }),
      });

      if (response.ok) {
        const data = await response.json();
        const generatedText = data.generated_text || data[0]?.generated_text || data.text;
        if (generatedText && generatedText.length > 0) {
          // Clean the response
          const cleanedText = this.cleanResponse(generatedText, message);
          if (cleanedText && cleanedText !== message) {
            return cleanedText;
          }
        }
      }
    } catch (error) {
      console.warn(`Endpoint ${endpoint} failed:`, error);
    }
    return null;
  }

  // Build scientific context from conversation history
  private static buildScientificContext(history: ChatMessage[]): string {
    if (history.length === 0) {
      return 'You are an expert scientific research assistant specializing in academic research, scientific publications, data analysis, and knowledge across various scientific disciplines.';
    }

    // Use recent conversation to maintain context
    const recentContext = history.slice(-3).map(msg => {
      if (msg.role === 'user') return `User: ${msg.content}`;
      return `Assistant: ${msg.content}`;
    }).join('\n');

    return `You are an expert scientific research assistant. Recent conversation:\n${recentContext}`;
  }

  // Clean and process the response
  private static cleanResponse(response: string, originalMessage: string): string | null {
    // Remove the original message if it was included in the response
    let cleaned = response.replace(originalMessage, '').trim();
    
    // Remove common prefixes
    cleaned = cleaned.replace(/^User:\s*/, '').trim();
    cleaned = cleaned.replace(/^Assistant:\s*/, '').trim();
    
    // If the cleaned response is too short or same as original, return null
    if (cleaned.length < 3 || cleaned === originalMessage) {
      return null;
    }

    return cleaned;
  }

  // Intelligent fallback response when API is unavailable
  private static getFallbackResponse(message: string, userId?: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Check for specific keywords and provide helpful responses
    if (lowerMessage.includes('research') || lowerMessage.includes('paper') || lowerMessage.includes('publication')) {
      return 'I can help you with research! You can search for scientific papers using CrossRef, PubMed, or ArXiv. Would you like to know how to find papers on a specific topic?';
    }
    
    if (lowerMessage.includes('doi') || lowerMessage.includes('citation')) {
      return 'DOIs (Digital Object Identifiers) are unique identifiers for scholarly documents. You can search papers by DOI in the Research Manager. Would you like me to explain more about DOI?';
    }
    
    if (lowerMessage.includes('library') || lowerMessage.includes('collection')) {
      return 'Your research library allows you to manage and organize scientific papers. You can add papers from various sources and tag them for easy retrieval.';
    }
    
    if (lowerMessage.includes('machine learning') || lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence')) {
      return 'Machine Learning and AI are fascinating fields! There are many research papers available. Would you like to search for specific papers on these topics?';
    }
    
    if (lowerMessage.includes('dashboard') || lowerMessage.includes('overview')) {
      return 'The dashboard provides an overview of your research activities, including recent papers, active projects, and collaborations.';
    }
    
    if (lowerMessage.includes('help')) {
      return 'I\'m here to help you with scientific research! I can assist with:\n- Finding research papers\n- Understanding DOIs and citations\n- Managing your research library\n- Exploring scientific topics\n\nWhat would you like to know?';
    }
    
    // Generic helpful response
    return 'I understand you\'re asking about scientific research. I\'m here to help with research papers, academic publications, and scientific knowledge. Could you be more specific about what you\'d like to know?';
  }

  // Stream response (for future enhancement)
  static async *streamResponse(userMessage: string, conversationHistory: ChatMessage[]): AsyncGenerator<string> {
    const response = await this.getResponse(userMessage, conversationHistory);
    // Simple character-by-character streaming for user experience
    for (const char of response) {
      yield char;
      await new Promise(resolve => setTimeout(resolve, 20)); // 50 chars/sec
    }
  }
}
