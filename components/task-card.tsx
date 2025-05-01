"use client"

import type { Task } from "@/lib/types"
import { motion } from "framer-motion"
import { Calendar, User } from "lucide-react"

interface TaskCardProps {
  task: Task
  index: number
}

export function TaskCard({ task, index }: TaskCardProps) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="overflow-hidden border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="pb-2 flex flex-col space-y-1.5 p-4 sm:p-6">
          <div
            className={`${getCategoryColor(task.category)} mb-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold`}
          >
            {task.category}
          </div>
          <h3 className="text-base sm:text-lg font-bold capitalize break-words">{task.task}</h3>
        </div>
        <div className="p-4 sm:p-6 pt-0">
          <div className="space-y-3">
            <div className="flex items-center text-xs sm:text-sm">
              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300 break-words">{task.who || "Not specified"}</span>
            </div>

            {task.deadline && (
              <div className="flex items-center text-xs sm:text-sm">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 break-words">{task.deadline}</span>
              </div>
            )}

            {task.context && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 italic break-words">{task.context}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
