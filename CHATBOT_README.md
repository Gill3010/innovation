# Scientific Research Chatbot

## Overview

A modern chatbot integrated into the Innova Proyectos platform that helps users with scientific research, academic publications, and knowledge discovery.

## Features

- **Free API Integration**: Uses Hugging Face Inference API (free tier) for AI-powered responses
- **Scientific Focus**: Specialized in answering questions about:
  - Research papers and publications
  - DOIs and citations
  - Scientific databases (CrossRef, PubMed, ArXiv)
  - Machine Learning and AI
  - Research management
  - Academic topics

- **Modern UI**: Matches the existing design system with:
  - Blue gradient color scheme
  - Smooth animations and transitions
  - Responsive design
  - Rounded corners and modern styling

- **Context-Aware**: Maintains conversation context for better responses
- **Fallback System**: Intelligent fallback responses when API is unavailable
- **Auto-Scrolling**: Automatically scrolls to new messages
- **Keyboard Support**: Press Enter to send messages

## Implementation

### Components

1. **Chatbot.tsx** (`components/Chatbot.tsx`)
   - Main chatbot UI component
   - Handles user input and message display
   - Toggle button and chat window
   - Loading states and animations

2. **ChatService** (`services/chatService.ts`)
   - API integration with Hugging Face
   - Intelligent fallback system
   - Context-aware conversation handling
   - Response cleaning and processing

### Integration

The chatbot is integrated into `ClientShell.tsx` and appears on all pages of the application with:
- Floating action button in bottom-right corner
- Toggle to open/close chat window
- Fixed positioning (always accessible)

## Usage

### For Users

1. Click the chat icon in the bottom-right corner
2. Type your question about scientific research
3. The chatbot will respond with helpful information
4. Examples of good questions:
   - "How do I search for research papers?"
   - "What is a DOI?"
   - "Tell me about machine learning"
   - "Help me manage my research library"

### For Developers

#### Adding Custom Responses

Edit `services/chatService.ts` to add more intelligent fallback responses:

```typescript
private static getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Add your custom logic here
  if (lowerMessage.includes('your-topic')) {
    return 'Your custom response';
  }
  
  return this.genericFallback();
}
```

#### Changing the AI Model

Update the `API_ENDPOINT` constant in `ChatService`:

```typescript
private static readonly API_ENDPOINT = 'https://api-inference.huggingface.co/models/your-model';
```

Available models on Hugging Face:
- `microsoft/DialoGPT-medium` - Conversational AI
- `google/flan-t5-base` - General purpose
- `facebook/blenderbot-400M-distill` - Social chatbot

## API Configuration

### Hugging Face Inference API

The chatbot uses the free tier of Hugging Face Inference API:

- **No API key required** for public models
- **Rate limits**: ~60 requests/minute
- **Automatic fallback**: If one model fails, tries alternatives
- **Error handling**: Graceful degradation with intelligent responses

### Alternative APIs

To use a different AI service (e.g., OpenAI), modify `services/chatService.ts`:

```typescript
static async getResponse(userMessage: string, conversationHistory: ChatMessage[]): Promise<string> {
  try {
    const response = await fetch('YOUR_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: conversationHistory,
        prompt: userMessage,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    return this.getFallbackResponse(userMessage);
  }
}
```

## Styling

The chatbot uses Tailwind CSS classes consistent with the project:

- **Colors**: Blue gradient (`from-blue-600 to-blue-700`)
- **Spacing**: Standard padding and margins
- **Animations**: Smooth transitions and hover effects
- **Shadows**: Multi-layer shadows for depth
- **Border Radius**: `rounded-2xl` for modern look

## Future Enhancements

Potential improvements:

1. **Streaming Responses**: Already prepared in `ChatService.streamResponse()`
2. **Voice Input**: Add speech recognition
3. **File Uploads**: Allow users to upload papers for analysis
4. **Custom Knowledge Base**: Train on project-specific documents
5. **Multi-language Support**: Use the existing TranslationContext
6. **Chat History**: Save conversations to Firebase
7. **Suggestions**: Quick action buttons for common tasks

## Testing

To test the chatbot:

1. Start the development server: `npm run dev`
2. Open the application in your browser
3. Click the chat icon in the bottom-right
4. Try various questions about scientific research
5. Test the fallback responses by disconnecting from the internet

## Troubleshooting

### API Not Responding

The chatbot includes intelligent fallback responses that work even when the API is unavailable. These responses are context-aware and maintain functionality.

### Slow Responses

The Hugging Face API may experience cold starts. Allow 10-30 seconds for the first request. Subsequent requests will be faster.

### Rate Limiting

If you exceed rate limits, the chatbot will use fallback responses. Consider implementing:
- Request throttling
- Response caching
- Alternative API endpoints

## Architecture

```
User Interaction
    ↓
Chatbot Component (UI)
    ↓
ChatService (Logic)
    ↓
Hugging Face API / Fallback
    ↓
Response Processing
    ↓
Display to User
```

## Code Quality

- **TypeScript**: Fully typed for safety
- **Error Handling**: Graceful degradation
- **Performance**: Optimized rendering
- **Accessibility**: ARIA labels and keyboard support
- **Responsive**: Works on all screen sizes

## Dependencies

No additional dependencies required! The chatbot uses:
- React (already in project)
- TypeScript (already in project)
- Tailwind CSS (already in project)
- Native fetch API

## License

Part of the Innova Proyectos platform.
