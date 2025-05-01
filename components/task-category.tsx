"use client"

import type { Task } from "@/lib/types"
import { TaskCard } from "./task-card"
import { motion } from "framer-motion"

interface TaskCategoryProps {
  category: string
  tasks: Task[]
}

export function TaskCategory({ category, tasks }: TaskCategoryProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task, index) => (
          <TaskCard key={index} task={task} index={index} />
        ))}
      </div>
    </motion.div>
  )
}
