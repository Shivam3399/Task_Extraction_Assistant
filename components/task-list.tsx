"use client"

import type { Task } from "@/lib/types"
import { motion } from "framer-motion"
import { Calendar, User } from "lucide-react"

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Meeting: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Documentation: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Shopping: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Security: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "Data Management": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      Troubleshooting: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      Communication: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      Planning: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "General Task": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    }

    return colors[category] || colors["General Task"]
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="bg-white dark:bg-gray-800 border rounded-lg p-4 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`${getCategoryColor(task.category)} inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold`}
                >
                  {task.category}
                </div>
                {task.deadline && (
                  <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1 inline" />
                    {task.deadline}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-medium capitalize">{task.task}</h3>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                <User className="h-3.5 w-3.5 mr-1 text-purple-600 dark:text-purple-400" />
                <span>{task.who || "Not specified"}</span>
              </div>

              {task.context && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-2">
                  {task.context}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
