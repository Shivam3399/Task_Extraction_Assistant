"use client"

import { useState } from "react"
import { FileDown, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Task } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface DownloadButtonProps {
  tasks: Task[]
  disabled?: boolean
}

export function DownloadButton({ tasks, disabled = false }: DownloadButtonProps) {
  const [isDownloadingCSV, setIsDownloadingCSV] = useState(false)
  const [isDownloadingText, setIsDownloadingText] = useState(false)
  const { toast } = useToast()

  // Download tasks as CSV
  const downloadCSV = () => {
    if (tasks.length === 0) {
      toast({
        title: "No tasks to download",
        description: "Extract some tasks first before downloading.",
        variant: "destructive",
      })
      return
    }

    setIsDownloadingCSV(true)

    try {
      // CSV header
      let csv = "Task,Who,Deadline,Category,Context\n"

      // Add each task as a row
      tasks.forEach((task) => {
        // Escape quotes in fields and wrap fields with quotes
        const escapedTask = `"${(task.task || "").replace(/"/g, '""')}"`
        const escapedWho = `"${(task.who || "").replace(/"/g, '""')}"`
        const escapedDeadline = task.deadline ? `"${task.deadline.replace(/"/g, '""')}"` : '""'
        const escapedCategory = `"${(task.category || "").replace(/"/g, '""')}"`
        const escapedContext = task.context ? `"${task.context.replace(/"/g, '""')}"` : '""'

        csv += `${escapedTask},${escapedWho},${escapedDeadline},${escapedCategory},${escapedContext}\n`
      })

      // Create download link
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)

      // Create and trigger download
      const downloadLink = document.createElement("a")
      downloadLink.href = url
      downloadLink.download = "extracted_tasks.csv"
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)

      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 100)

      toast({
        title: "Download complete",
        description: "Your tasks have been downloaded as CSV.",
      })
    } catch (error) {
      console.error("Error downloading CSV:", error)
      toast({
        title: "Download failed",
        description: "There was an error downloading your tasks.",
        variant: "destructive",
      })
    } finally {
      setIsDownloadingCSV(false)
    }
  }

  // Download as plain text
  const downloadText = () => {
    if (tasks.length === 0) {
      toast({
        title: "No tasks to download",
        description: "Extract some tasks first before downloading.",
        variant: "destructive",
      })
      return
    }

    setIsDownloadingText(true)

    try {
      let text = "EXTRACTED TASKS\n\n"

      tasks.forEach((task, index) => {
        text += `TASK ${index + 1}:\n`
        text += `- Action: ${task.task || "Not specified"}\n`
        text += `- Assigned to: ${task.who || "Not specified"}\n`
        text += `- Deadline: ${task.deadline || "Not specified"}\n`
        text += `- Category: ${task.category || "Not specified"}\n`
        if (task.context) {
          text += `- Context: ${task.context}\n`
        }
        text += "\n"
      })

      // Create download link
      const blob = new Blob([text], { type: "text/plain;charset=utf-8;" })
      const url = URL.createObjectURL(blob)

      // Create and trigger download
      const downloadLink = document.createElement("a")
      downloadLink.href = url
      downloadLink.download = "extracted_tasks.txt"
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)

      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 100)

      toast({
        title: "Download complete",
        description: "Your tasks have been downloaded as text.",
      })
    } catch (error) {
      console.error("Error downloading text:", error)
      toast({
        title: "Download failed",
        description: "There was an error downloading your tasks.",
        variant: "destructive",
      })
    } finally {
      setIsDownloadingText(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={downloadCSV}
        disabled={disabled || isDownloadingCSV || tasks.length === 0}
        className="flex items-center"
      >
        <FileDown className="h-4 w-4 mr-1" />
        {isDownloadingCSV ? "Downloading..." : "CSV"}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={downloadText}
        disabled={disabled || isDownloadingText || tasks.length === 0}
        className="flex items-center"
      >
        <FileText className="h-4 w-4 mr-1" />
        {isDownloadingText ? "Downloading..." : "Text"}
      </Button>
    </div>
  )
}
