"use client"

import { useState } from "react"
import { extractTasks } from "@/lib/task-extractor"
import { TaskCard } from "@/components/task-card"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import type { Task } from "@/lib/types"
import { Textarea } from "@/components/ui/textarea"
import { ViewToggle } from "@/components/view-toggle"
import { TaskList } from "@/components/task-list"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DownloadButton } from "@/components/download-button"
import { TaskCategory } from "@/components/task-category"
import { AnimeCharacter } from "@/components/anime-character"
import { FileText } from "lucide-react"

export default function Home() {
  const [text, setText] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)

  // Group tasks by category
  const tasksByCategory: Record<string, Task[]> = {}
  tasks.forEach((task) => {
    if (!tasksByCategory[task.category]) {
      tasksByCategory[task.category] = []
    }
    tasksByCategory[task.category].push(task)
  })

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
    setUploadedFileName(null)
  }

  const handleFileUpload = (content: string, fileName: string) => {
    setText(content)
    setUploadedFileName(fileName)
    alert(`Successfully loaded content from "${fileName}"`)
  }

  const categories = Object.keys(tasksByCategory)

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enter your unstructured text:
                  </label>
                  {uploadedFileName && (
                    <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                      <FileText className="h-3.5 w-3.5 mr-1" />
                      <span>{uploadedFileName}</span>
                    </div>
                  )}
                </div>
                <Textarea
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Example: John needs to submit the report by Friday. The team should meet to discuss the project at 3 PM tomorrow."
                  className="min-h-[200px]"
                  onFileUpload={handleFileUpload}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  You can also upload a TXT file using the upload button in the textarea.
                </p>
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
          </div>

          <div className="hidden lg:flex lg:justify-center lg:items-center">
            <AnimeCharacter tasks={tasks} loading={loading} />
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

              <div className="flex items-center gap-3">
                <DownloadButton tasks={tasks} />
                <ViewToggle view={viewMode} onViewChange={setViewMode} />
              </div>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task, index) => (
                      <TaskCard key={index} task={task} index={index} />
                    ))}
                  </div>
                ) : (
                  <TaskList tasks={tasks} />
                )}
              </TabsContent>

              {categories.map((category) => (
                <TabsContent key={category} value={category}>
                  {viewMode === "grid" ? (
                    <TaskCategory category={category} tasks={tasksByCategory[category]} />
                  ) : (
                    <TaskList tasks={tasksByCategory[category]} />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        )}

        <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Task Extraction Assistant © 2025 | Built with Next.js</p>
        </div>
      </div>
    </main>
  )
}
