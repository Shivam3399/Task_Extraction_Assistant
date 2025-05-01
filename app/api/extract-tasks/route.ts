import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs/promises"
import path from "path"
import type { Task } from "@/lib/types"

const execAsync = promisify(exec)

// Check if Python and required packages are available
async function checkPythonEnvironment() {
  try {
    await execAsync("python --version")
    return true
  } catch (error) {
    console.error("Python is not available:", error)
    return false
  }
}

// Create a temporary Python script with our task extraction code
async function createTempPythonScript(text: string) {
  const scriptDir = path.join(process.cwd(), "tmp")
  const scriptPath = path.join(scriptDir, "extract_tasks.py")
  const inputPath = path.join(scriptDir, "input.txt")
  const outputPath = path.join(scriptDir, "output.json")

  // Create directory if it doesn't exist
  try {
    await fs.mkdir(scriptDir, { recursive: true })
  } catch (error) {
    console.error("Error creating directory:", error)
  }

  // Write input text to file
  await fs.writeFile(inputPath, text)

  // Write Python script
  const pythonScript = `
import json
import re
import sys
import os

try:
    import spacy
    import dateparser
    ADVANCED_MODE = True
except ImportError:
    ADVANCED_MODE = False

# Constants
ACTION_VERBS = ["buy", "clean", "submit", "finish", "prepare", "deliver", "set", "attend", "make", "complete",
              "register", "book", "acknowledge", "schedule", "notify", "resolve", "analyze", "review", 
              "create", "update", "send", "organize", "call", "write", "read", "check", "verify", "meet"]

CATEGORIES = {
    "Meeting": ["meeting", "conference", "call", "discussion", "presentation", "workshop", "seminar", "webinar", "meet"],
    "Documentation": ["report", "document", "presentation", "slides", "paper", "write", "draft", "review"],
    "Shopping": ["grocery", "shopping", "buy", "purchase", "order", "deliver"],
    "Security": ["security", "password", "login", "authentication", "access", "protect", "encrypt"],
    "Data Management": ["backup", "data", "database", "storage", "file", "upload", "download"],
    "Troubleshooting": ["error", "issue", "problem", "bug", "fix", "resolve", "debug", "troubleshoot"],
    "Communication": ["email", "call", "message", "notify", "inform", "contact", "respond"],
    "Planning": ["plan", "schedule", "organize", "arrange", "coordinate", "prepare"]
}

def assign_category(text):
    text = text.lower()
    
    for category, keywords in CATEGORIES.items():
        if any(keyword in text for keyword in keywords):
            return category
    
    return "General Task"

def extract_deadline_simple(text):
    # Simple regex patterns to match common deadline formats
    patterns = [
        r'by\\s([A-Za-z]+\\s\\d{1,2}(?:st|nd|rd|th)?)',  # by January 1st
        r'by\\s(\\d{1,2}(?:st|nd|rd|th)?\\s[A-Za-z]+)',  # by 1st January
        r'by\\s(tomorrow|today|next\\s\\w+)',  # by tomorrow, by next week
        r'by\\s(\\d{1,2}:\\d{2}\\s?(?:am|pm)?)',  # by 3:00 pm
        r'before\\s([A-Za-z]+\\s\\d{1,2}(?:st|nd|rd|th)?)',
        r'until\\s([A-Za-z]+\\s\\d{1,2}(?:st|nd|rd|th)?)',
        r'on\\s([A-Za-z]+\\s\\d{1,2}(?:st|nd|rd|th)?)',
        r'(\\d{1,2}\\/\\d{1,2}\\/\\d{2,4})',  # 01/01/2025
        r'(\\d{4}-\\d{2}-\\d{2})',  # 2025-01-01
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match and match.group(1):
            return match.group(1)
    
    return None

def extract_person_simple(text):
    # Simple extraction of names (capitalized words)
    name_pattern = r'\\b([A-Z][a-z]+(?:\\s[A-Z][a-z]+)*)\\b'
    names = re.findall(name_pattern, text)
    
    # Filter out common words that might be capitalized
    common_words = ["I", "The", "A", "An", "This", "That", "These", "Those", 
                    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    filtered_names = [name for name in names if name not in common_words]
    
    if filtered_names:
        return filtered_names[0]
    
    # Check for pronouns or common role words
    pronoun_pattern = r'\\b(he|she|they|team|manager|staff|employee|user|admin|customer|client)\\b'
    pronoun_match = re.search(pronoun_pattern, text, re.IGNORECASE)
    
    return pronoun_match.group(1) if pronoun_match else "Unknown"

def extract_tasks_simple(text):
    tasks = []
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    for sentence in sentences:
        # Check if sentence contains an action verb
        contains_action_verb = any(verb in sentence.lower() for verb in ACTION_VERBS)
        
        if contains_action_verb:
            # Find which verb is in the sentence
            verb = next((v for v in ACTION_VERBS if v in sentence.lower()), "")
            
            task = {
                "task": verb,
                "who": extract_person_simple(sentence),
                "deadline": extract_deadline_simple(sentence),
                "category": assign_category(sentence),
                "context": sentence.strip()
            }
            
            tasks.append(task)
    
    return tasks

def extract_tasks_advanced(text):
    try:
        nlp = spacy.load("en_core_web_sm")
        doc = nlp(text)
        
        tasks = []
        
        # Process each sentence
        for sent in doc.sents:
            sentence = sent.text.strip()
            if not sentence:
                continue
                
            # Look for action verbs
            contains_verb = False
            verb = ""
            person = "Unknown"
            
            for token in sent:
                if token.pos_ == "VERB" and token.lemma_ in ACTION_VERBS:
                    contains_verb = True
                    verb = token.lemma_
                    
                    # Find subject (person responsible)
                    for child in token.children:
                        if child.dep_ in ["nsubj", "nsubjpass"]:
                            person = child.text
                            break
            
            if contains_verb:
                # Extract deadline using dateparser for more advanced date recognition
                deadline = None
                date_patterns = [
                    r'by\\s([^,.]+)',
                    r'before\\s([^,.]+)',
                    r'due\\s(?:on|by)?\\s([^,.]+)',
                    r'on\\s([^,.]+)',
                    r'(?:deadline|due date)[:\\s]+([^,.]+)'
                ]
                
                for pattern in date_patterns:
                    match = re.search(pattern, sentence, re.IGNORECASE)
                    if match:
                        date_text = match.group(1)
                        parsed_date = dateparser.parse(date_text)
                        if parsed_date:
                            deadline = parsed_date.strftime("%Y-%m-%d")
                            break
                
                if not deadline:
                    # Fall back to simple extraction
                    deadline = extract_deadline_simple(sentence)
                
                # If no person found through dependency parsing, try NER
                if person == "Unknown":
                    for ent in sent.ents:
                        if ent.label_ == "PERSON":
                            person = ent.text
                            break
                
                task = {
                    "task": verb,
                    "who": person,
                    "deadline": deadline,
                    "category": assign_category(sentence),
                    "context": sentence
                }
                
                tasks.append(task)
        
        return tasks
    except Exception as e:
        print(f"Error in advanced extraction: {e}")
        # Fall back to simple extraction
        return extract_tasks_simple(text)

def main():
    # Read input text
    input_path = "${inputPath.replace(/\\/g, "\\\\")}"
    output_path = "${outputPath.replace(/\\/g, "\\\\")}"
    
    with open(input_path, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Extract tasks based on available libraries
    if ADVANCED_MODE:
        print("Using advanced NLP extraction...")
        tasks = extract_tasks_advanced(text)
    else:
        print("Using simple extraction...")
        tasks = extract_tasks_simple(text)
    
    # Write results to output file
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(tasks, f, ensure_ascii=False, indent=2)
    
    print(f"Extracted {len(tasks)} tasks")

if __name__ == "__main__":
    main()
  `

  await fs.writeFile(scriptPath, pythonScript)

  return { scriptPath, outputPath }
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid input. Please provide text." }, { status: 400 })
    }

    // Check if Python is available
    const pythonAvailable = await checkPythonEnvironment()

    if (!pythonAvailable) {
      // Return a specific error that the client can handle
      return NextResponse.json({ error: "Python environment not available", fallback: true }, { status: 503 })
    }

    // Create temporary Python script
    const { scriptPath, outputPath } = await createTempPythonScript(text)

    // Execute Python script
    await execAsync(`python ${scriptPath}`)

    // Read results
    const outputJson = await fs.readFile(outputPath, "utf-8")
    const tasks = JSON.parse(outputJson) as Task[]

    // Clean up temporary files
    try {
      await fs.unlink(scriptPath)
      await fs.unlink(outputPath)
    } catch (error) {
      console.error("Error cleaning up temporary files:", error)
    }

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Failed to process request", fallback: true }, { status: 500 })
  }
}
