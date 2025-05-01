import type { Task } from "./types"

const ACTION_VERBS = [
  "buy",
  "clean",
  "submit",
  "finish",
  "prepare",
  "deliver",
  "set",
  "attend",
  "make",
  "complete",
  "register",
  "book",
  "acknowledge",
  "schedule",
  "notify",
  "resolve",
  "analyze",
  "review",
  "create",
  "update",
  "send",
  "organize",
  "call",
  "write",
  "read",
  "check",
  "verify",
  "meet",
]

const CATEGORIES = {
  Meeting: ["meeting", "conference", "call", "discussion", "presentation"],
  Documentation: ["report", "document", "presentation", "slides", "paper"],
  Shopping: ["grocery", "shopping", "buy", "purchase", "order"],
  Security: ["security", "password", "login", "authentication", "access"],
  "Data Management": ["backup", "data", "database", "storage", "file"],
  Troubleshooting: ["error", "issue", "problem", "bug", "fix"],
  Communication: ["email", "call", "message", "notify", "inform"],
  Planning: ["plan", "schedule", "organize", "arrange", "coordinate"],
}

function assignCategory(text: string): string {
  text = text.toLowerCase()

  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return category
    }
  }

  return "General Task"
}

function extractDeadline(text: string): string | null {
  const patterns = [
    /by\s([A-Za-z]+\s\d{1,2}(?:st|nd|rd|th)?)/i,
    /by\s(\d{1,2}(?:st|nd|rd|th)?\s[A-Za-z]+)/i,
    /by\s(tomorrow|today|next\s\w+)/i,
    /by\s(\d{1,2}:\d{2}\s?(?:am|pm)?)/i,
    /before\s([A-Za-z]+\s\d{1,2}(?:st|nd|rd|th)?)/i,
    /until\s([A-Za-z]+\s\d{1,2}(?:st|nd|rd|th)?)/i,
    /on\s([A-Za-z]+\s\d{1,2}(?:st|nd|rd|th)?)/i,
    /(\d{1,2}\/\d{1,2}\/\d{2,4})/,
    /(\d{4}-\d{2}-\d{2})/,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

function extractPerson(text: string): string {
  const namePattern = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b/g
  const names = Array.from(text.matchAll(namePattern), (m) => m[1])

  const commonWords = [
    "I",
    "The",
    "A",
    "An",
    "This",
    "That",
    "These",
    "Those",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]
  const filteredNames = names.filter((name) => !commonWords.includes(name))

  if (filteredNames.length > 0) {
    return filteredNames[0]
  }

  const pronounPattern = /\b(he|she|they|team|manager|staff|employee|user|admin|customer|client)\b/i
  const pronounMatch = text.match(pronounPattern)

  return pronounMatch ? pronounMatch[1] : "Unknown"
}

export async function extractTasks(text: string): Promise<Task[]> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const tasks: Task[] = []
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)

  for (const sentence of sentences) {
    const containsActionVerb = ACTION_VERBS.some((verb) => sentence.toLowerCase().includes(verb))

    if (containsActionVerb) {
      const verb = ACTION_VERBS.find((v) => sentence.toLowerCase().includes(v)) || ""

      const task: Task = {
        task: verb,
        who: extractPerson(sentence),
        deadline: extractDeadline(sentence),
        category: assignCategory(sentence),
        context: sentence.trim(),
      }

      tasks.push(task)
    }
  }

  return tasks
}
