export interface MotivationalQuote {
  id: number;
  text: string;
  author: string;
  category: string;
}

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    id: 1,
    text: "Consistency beats intensity.",
    author: "Core Principle",
    category: "Mindset"
  },
  {
    id: 2,
    text: "One problem at a time. One step closer.",
    author: "Interview Mindset",
    category: "Focus"
  },
  {
    id: 3,
    text: "Don't just read the solution. Build the intuition.",
    author: "DSA Mastery",
    category: "Learning"
  },
  {
    id: 4,
    text: "Your future self will thank you for today's effort.",
    author: "Personal Growth",
    category: "Motivation"
  },
  {
    id: 5,
    text: "Every bug you fix makes you a better engineer.",
    author: "Engineering Mindset",
    category: "Resilience"
  },
  {
    id: 6,
    text: "Master the fundamentals. Trust the process.",
    author: "Problem Solving",
    category: "Foundations"
  },
  {
    id: 7,
    text: "You don't need a perfect day. You need a productive next 30 minutes.",
    author: "Daily Execution",
    category: "Action"
  },
  {
    id: 8,
    text: "Understand the pattern, not just the answer.",
    author: "Pattern Recognition",
    category: "Strategy"
  },
  {
    id: 9,
    text: "Small daily wins compound into extraordinary results.",
    author: "Atomic Habits",
    category: "Consistency"
  },
  {
    id: 10,
    text: "Solve independently. Learn deeply. Repeat.",
    author: "Coding Commandment",
    category: "Discipline"
  }
];
