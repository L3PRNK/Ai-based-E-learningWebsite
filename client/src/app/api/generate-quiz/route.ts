import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { topic, difficulty, questionCount } = await req.json();

  // TODO: Replace this with your Groq API call
  // This is a mock response for demonstration
  const quiz = {
    questions: Array.from({ length: questionCount }, (_, i) => ({
      text: `Sample question ${i + 1} about ${topic}?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctIndex: 0,
      explanation: "Sample explanation.",
    })),
  };

  return NextResponse.json({ quiz });
}