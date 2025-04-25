export interface QuizParameters {
    topic: string;
    numQuestions: number;
    difficulty: 'easy' | 'medium' | 'hard';
    questionType: 'multiple choice' | 'true/false' | 'short answer';
    context: string;
  }
  
  export interface QuizResponse {
    result?: string; // Quiz text from OpenAI
    error?: string;   // Error message (if any)
  }