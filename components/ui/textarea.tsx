"use client"

import * as React from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { readTextFile } from "@/lib/client-file-reader"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onFileUpload?: (content: string, fileName: string) => void
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, onFileUpload, ...props }, ref) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onFileUpload) return

    // Check file type
    const fileType = file.type
    const isTextFile = fileType === "text/plain"

    if (!isTextFile) {
      alert("Please upload a TXT file")
      return
    }

    try {
      // Read the file content client-side
      const content = await readTextFile(file)
      onFileUpload(content, file.name)
    } catch (error) {
      console.error("Error reading file:", error)
      alert("Failed to read file. Please try again.")
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="relative">
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
      {onFileUpload && (
        <>
          <button
            type="button"
            onClick={triggerFileUpload}
            className="absolute right-3 bottom-3 p-1.5 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
            title="Upload TXT file"
          >
            <Upload className="h-4 w-4" />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt" className="hidden" />
        </>
      )}
    </div>
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
