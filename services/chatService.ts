// Chat service for the scientific research assistant chatbot
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
  static async getResponse(userMessage: string, conversationHistory: ChatMessage[]): Promise<string> {
    try {
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
      return this.getFallbackResponse(userMessage);
    } catch (error) {
      console.error('Error in chat service:', error);
      return this.getFallbackResponse(userMessage);
    }
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
  private static cleanResponse(response: string, originalMessage: string): string {
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
  private static getFallbackResponse(message: string): string {
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
