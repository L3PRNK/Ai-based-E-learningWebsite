import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text_content, quiz_level, question_count = 5 } = await req.json();

    // Validate inputs
    if (!text_content) {
      return NextResponse.json({ error: "Text content is required" }, { status: 400 });
    }

    // Create a prompt for Groq to generate quiz questions
    const prompt = `
    You are a quiz generator. Based on the following content, create ${question_count} multiple-choice questions at a ${quiz_level} difficulty level.

    CONTENT:
    ${text_content}

    For each question:
    1. Create a clear, specific question about the content
    2. Provide 4 answer options labeled a, b, c, and d
    3. Indicate which option is correct
    4. Ensure all distractors (wrong answers) are plausible but clearly incorrect

    Return the result as a JSON array with this exact structure:
    {
      "mcqs": [
        {
          "mcq": "Question text here?",
          "options": {
            "a": "First option",
            "b": "Second option",
            "c": "Third option",
            "d": "Fourth option"
          },
          "correct": "a"
        },
        // more questions...
      ]
    }
    
    The 'correct' field should be a single letter (a, b, c, or d) corresponding to the correct answer option.
    `;

    // Make request to Groq API
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not defined in environment variables");
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // or another model like "mixtral-8x7b-32768"
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API error:", errorData);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse the response content
    const responseContent = data.choices[0].message.content;
    let parsedResponse;
    
    try {
      parsedResponse = JSON.parse(responseContent);
    } catch (error) {
      console.error("Failed to parse Groq response as JSON:", responseContent);
      throw new Error("Invalid JSON response from Groq API");
    }
    
    // Validate the structure of the parsed response
    if (!parsedResponse.mcqs || !Array.isArray(parsedResponse.mcqs)) {
      console.error("Invalid response structure:", parsedResponse);
      throw new Error("Invalid response format from Groq");
    }

    return NextResponse.json(parsedResponse);
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate quiz questions" },
      { status: 500 }
    );
  }
}