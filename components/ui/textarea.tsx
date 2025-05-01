"use client"

import * as React from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

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
    const isPdfFile = fileType === "application/pdf"

    if (!isTextFile && !isPdfFile) {
      alert("Please upload a TXT or PDF file")
      return
    }

    try {
      // Create form data for upload
      const formData = new FormData()
      formData.append("file", file)

      // Upload file to server
      const response = await fetch("/api/upload-file", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("File upload failed")
      }

      const data = await response.json()
      onFileUpload(data.content, file.name)
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Failed to upload file. Please try again.")
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="relative">
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
            className="absolute right-3 bottom-3 p-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            title="Upload TXT or PDF file"
          >
            <Upload className="h-4 w-4" />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt,.pdf" className="hidden" />
        </>
      )}
    </div>
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
