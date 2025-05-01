"use client"

import { useState } from "react"
import { extractTasks } from "@/lib/task-extractor"
import { TaskCard } from "@/components/task-card"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import type { Task } from "@/lib/types"

export default function Home() {
  const [text, setText] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)

  const handleExtractTasks = async () => {
    if (!text.trim()) {
      alert("Please enter some text to extract tasks from.")
      return
    }

    setLoading(true)
    try {
      const extractedTasks = await extractTasks(text)
      setTasks(extractedTasks)

      if (extractedTasks.length === 0) {
        alert("No actionable tasks were found in the text.")
      }
    } catch (error) {
      alert("Failed to extract tasks. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setText("")
    setTasks([])
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-300 mb-2">Task Extraction Assistant</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Enter your unstructured text and I&apos;ll extract all actionable tasks!
            </p>
          </motion.div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="mb-4">
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter your unstructured text:
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Example: John needs to submit the report by Friday. The team should meet to discuss the project at 3 PM tomorrow."
              className="w-full min-h-[200px] rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleExtractTasks}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? "Extracting..." : "Extract Tasks"}
            </button>
            <button
              onClick={handleClear}
              className="border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900 px-4 py-2 rounded-md"
            >
              Clear
            </button>
          </div>
        </div>

        {tasks.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                Extracted Tasks ({tasks.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task, index) => (
                <TaskCard key={index} task={task} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Task Extraction Assistant © 2025 | Built with Next.js</p>
        </div>
      </div>
    </main>
  )
}
