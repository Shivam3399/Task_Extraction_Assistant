"use client"

import type { Task } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface AnimeCharacterProps {
  tasks: Task[]
  loading: boolean
}

export function AnimeCharacter({ tasks, loading }: AnimeCharacterProps) {
  const [message, setMessage] = useState("Hi there! I'll help you extract tasks!")
  const [characterState, setCharacterState] = useState<"idle" | "thinking" | "happy" | "confused">("idle")

  useEffect(() => {
    if (loading) {
      setCharacterState("thinking")
      setMessage("Hmm, let me analyze this text...")
    } else if (tasks.length > 0) {
      setCharacterState("happy")
      setMessage(`Found ${tasks.length} tasks! Check them out below.`)
    } else if (tasks.length === 0 && !loading) {
      setCharacterState("confused")
      setMessage("I couldn't find any tasks. Try adding more text!")
    } else {
      setCharacterState("idle")
      setMessage("Hi there! I'll help you extract tasks!")
    }
  }, [loading, tasks])

  return (
    <div className="w-full flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={characterState}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] relative mx-auto">
            <div
              className={`w-full h-full rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center`}
            >
              <span className="text-2xl sm:text-3xl">
                {characterState === "thinking" && "🤔"}
                {characterState === "happy" && "😊"}
                {characterState === "confused" && "😕"}
                {characterState === "idle" && "👋"}
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg max-w-[200px] text-center relative mx-auto"
          >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white dark:bg-gray-800 rotate-45"></div>
            <p className="text-gray-800 dark:text-gray-200 font-medium text-xs sm:text-sm">
              {message} <span className="text-purple-600 dark:text-purple-400">✨</span>
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
