import type { Task } from "./types"

// This is a simplified JavaScript version of our Python task extraction algorithm
// It will be used as a fallback if the Python backend is not available

const isVercelDeployment = process.env.VERCEL === "1"

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
  "present",
  "discuss",
]

const CATEGORIES = {
  Meeting: ["meeting", "conference", "call", "discussion", "presentation", "workshop", "seminar", "webinar", "meet"],
  Documentation: ["report", "document", "presentation", "slides", "paper", "write", "draft", "review"],
  Shopping: ["grocery", "shopping", "buy", "purchase", "order", "deliver"],
  Security: ["security", "password", "login", "authentication", "access", "protect", "encrypt"],
  "Data Management": ["backup", "data", "database", "storage", "file", "upload", "download"],
  Troubleshooting: ["error", "issue", "problem", "bug", "fix", "resolve", "debug", "troubleshoot"],
  Communication: ["email", "call", "message", "notify", "inform", "contact", "respond"],
  Planning: ["plan", "schedule", "organize", "arrange", "coordinate", "prepare"],
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
  // Simple regex patterns to match common deadline formats
  const patterns = [
    /by\s([A-Za-z]+\s\d{1,2}(?:st|nd|rd|th)?)/i, // by January 1st
    /by\s(\d{1,2}(?:st|nd|rd|th)?\s[A-Za-z]+)/i, // by 1st January
    /by\s(tomorrow|today|next\s\w+)/i, // by tomorrow, by next week
    /by\s(\d{1,2}:\d{2}\s?(?:am|pm)?)/i, // by 3:00 pm
    /before\s([A-Za-z]+\s\d{1,2}(?:st|nd|rd|th)?)/i,
    /until\s([A-Za-z]+\s\d{1,2}(?:st|nd|rd|th)?)/i,
    /on\s([A-Za-z]+\s\d{1,2}(?:st|nd|rd|th)?)/i,
    /(\d{1,2}\/\d{1,2}\/\d{2,4})/, // 01/01/2025
    /(\d{4}-\d{2}-\d{2})/, // 2025-01-01
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
  // Simple extraction of names (capitalized words)
  const namePattern = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b/g
  const names = Array.from(text.matchAll(namePattern), (m) => m[1])

  // Filter out common words that might be capitalized
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

  // Check for pronouns or common role words
  const pronounPattern = /\b(he|she|they|team|manager|staff|employee|user|admin|customer|client)\b/i
  const pronounMatch = text.match(pronounPattern)

  return pronounMatch ? pronounMatch[1] : "Unknown"
}

// JavaScript fallback implementation
function extractTasksJavaScript(text: string): Task[] {
  const tasks: Task[] = []
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)

  for (const sentence of sentences) {
    // Check if sentence contains an action verb
    const containsActionVerb = ACTION_VERBS.some((verb) => sentence.toLowerCase().includes(verb))

    if (containsActionVerb) {
      // Find which verb is in the sentence
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

// Check if we're in basic mode (no Python API available)
let isBasicMode = false

// Main function that tries the Python API first, then falls back to JavaScript
export async function extractTasks(text: string): Promise<Task[]> {
  // If we're on Vercel or already know we're in basic mode, use JavaScript
  if (isVercelDeployment || isBasicMode) {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return extractTasksJavaScript(text)
  }

  try {
    // Try to use the Python API first
    const response = await fetch("/api/extract-tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })

    const data = await response.json()

    // If the API returns a fallback flag, use the JavaScript implementation
    if (data.fallback || !response.ok) {
      // Remember that we're in basic mode to avoid future API calls
      isBasicMode = true
      console.log("Using JavaScript implementation for task extraction")
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return extractTasksJavaScript(text)
    }

    return data.tasks
  } catch (error) {
    // Remember that we're in basic mode to avoid future API calls
    isBasicMode = true
    console.log("Using JavaScript implementation for task extraction")

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return extractTasksJavaScript(text)
  }
}
