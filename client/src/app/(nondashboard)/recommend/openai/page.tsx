import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
});

export interface AIRecommendation {
  category: string;
  confidence: number;
  explanation: string;
  suggestedRoadmap: string[];
}

export const getAIRecommendations = async (userGoal: string): Promise<AIRecommendation> => {
  const prompt = `
    As a learning advisor, analyze this learning goal: "${userGoal}"
    
    Consider these categories:
    - Web Development
    - Mobile App Development
    - Cloud Computing
    - Machine Learning
    - Data Science
    - Cybersecurity
    - Game Development
    - IoT
    
    Provide a JSON response with:
    - Most relevant category
    - Confidence score (0-1)
    - Brief explanation
    - Customized learning roadmap steps
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an AI learning advisor that helps recommend learning paths."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("Response content is null");
  }
  const result = JSON.parse(content);
  return result;
};