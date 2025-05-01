"use client"

import { useState } from "react"
import { extractTasks } from "@/lib/task-extractor"
import { TaskCard } from "@/components/task-card"
import { AnimeCharacter } from "@/components/anime-character"
import { TaskCategory } from "@/components/task-category"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Task } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { ApiStatus } from "@/components/api-status"
import { ViewToggle } from "@/components/view-toggle"
import { TaskList } from "@/components/task-list"
import { DownloadButton } from "@/components/download-button"
import { FileText } from "lucide-react"

export default function Home() {
  const [text, setText] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const { toast } = useToast()

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
      toast({
        title: "Empty text",
        description: "Please enter some text to extract tasks from.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // This will try the Python API first, then fall back to JavaScript if needed
      const extractedTasks = await extractTasks(text)
      setTasks(extractedTasks)

      if (extractedTasks.length === 0) {
        toast({
          title: "No tasks found",
          description: "No actionable tasks were found in the text.",
          variant: "default",
        })
      } else {
        toast({
          title: "Tasks extracted!",
          description: `Found ${extractedTasks.length} tasks in your text.`,
          variant: "default",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extract tasks. Please try again.",
        variant: "destructive",
      })
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

    toast({
      title: "File uploaded",
      description: `Successfully loaded content from "${fileName}"`,
    })
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
            <ApiStatus />
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
                  placeholder="Example: John needs to submit the report by Friday. The team should meet to discuss the project at 3 PM tomorrow. Or upload a TXT/PDF file."
                  className="min-h-[200px]"
                  onFileUpload={handleFileUpload}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  You can also upload a TXT or PDF file using the upload button in the textarea.
                </p>
              </div>
              <div className="flex space-x-4">
                <Button onClick={handleExtractTasks} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                  {loading ? "Extracting..." : "Extract Tasks"}
                </Button>
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900"
                >
                  Clear
                </Button>
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
          <p>Task Extraction Assistant © 2025 | Built with Next.js and NLP</p>
        </div>
      </div>
    </main>
  )
}
