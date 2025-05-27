interface AIResponse {
  text: string;
  error?: string;
}

// Gemini API implementation
export const callGeminiAPI = async (prompt: string): Promise<AIResponse> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      console.error('Environment variables:', import.meta.env);
      throw new Error('Gemini API key not found. Please check your .env file.');
    }

    console.log('API Key found:', apiKey ? 'Yes' : 'No');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
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

//  DeepSeek API implementation
// export const callDeepSeekAPI = async (prompt: string): Promise<AIResponse> => {
//   try {
//     const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

//     if (!apiKey) {
//       throw new Error('DeepSeek API key not found. Please add it to your .env file or use Gemini only.');
//     }

//       const response = await fetch('https://api.deepseek.com/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${apiKey}`,
//       },
//       body: JSON.stringify({
//         model: "deepseek-chat",
//         messages: [
//           {
//             role: "user",
//             content: prompt
//           }
//         ],
//         max_tokens: 1000,
//         temperature: 0.7
//       })
//     });

//     if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         if (response.status === 402) {
//             throw new Error("DeepSeek API error! Status: 402. You have insufficient balance in your DeepSeek account.");
//         }
//         throw new Error(`DeepSeek API error! Status: ${response.status}. ${errorData.error?.message || ''}`);
//     }


//     const data = await response.json();

//     // Extract text from DeepSeek's response format
//     const generatedText = data.choices?.[0]?.message?.content;

//     if (!generatedText) {
//       throw new Error('No text generated from DeepSeek API');
//     }

//     return {
//       text: generatedText
//     };
//   } catch (error) {
//     console.error("Error calling DeepSeek API:", error);
//     return {
//       text: "Sorry, I encountered an error with the DeepSeek API. Please try again or switch to Gemini.",
//       error: error instanceof Error ? error.message : "Unknown error"
//     };
//   }
// };

// Main function that routes to the appropriate model


export const getAIResponse = async (
  prompt: string,
): Promise<AIResponse> => {
  const cookingContext = "You are a helpful AI cooking assistant. Provide information, recipes, and advice about cooking, meal planning, and nutrition. Keep responses focused on food and cooking.";
  const enhancedPrompt = `${cookingContext}\n\nUser query: ${prompt}`;

  return callGeminiAPI(enhancedPrompt);
};
