interface AIResponse {
  text: string;
  error?: string;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// Gemini API implementation with conversation history
export const callGeminiAPI = async (prompt: string, history: Message[] = []): Promise<AIResponse> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      console.error('Environment variables:', import.meta.env);
      throw new Error('Gemini API key not found. Please check your .env file.');
    }

    // Format conversation history for Gemini API
    const contents = [];

    // Add system message for context
    contents.push({
      role: "user",
      parts: [{ text: "You are a helpful AI cooking assistant. Provide information, recipes, and advice about cooking, meal planning, and nutrition. Keep responses focused on food and cooking." }]
    });

    // Add response acknowledging the role
    contents.push({
      role: "model",
      parts: [{ text: "I understand! I'm your cooking assistant. I'll focus on providing helpful information about cooking, recipes, meal planning, and nutrition." }]
    });

    // Add conversation history
    for (const message of history) {
      // Map our roles to Gemini API roles
      const role = message.role === 'user' ? 'user' : 'model';
      contents.push({
        role: role,
        parts: [{ text: message.content }]
      });
    }

    // Add the current prompt
    contents.push({
      role: "user",
      parts: [{ text: prompt }]
    });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error! Status: ${response.status}. ${errorData.error?.message || ''}`);
    }

    const data = await response.json();

    // Extract text from Gemini's response format
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No text generated from Gemini API');
    }

    return {
      text: generatedText
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      text: "Sorry, I encountered an error with the Gemini API. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

// Main function that routes to the appropriate model
export const getAIResponse = async (
  prompt: string,
  history: Message[] = []
): Promise<AIResponse> => {
  return callGeminiAPI(prompt, history);
};
