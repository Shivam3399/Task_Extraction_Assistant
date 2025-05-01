import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import * as fs from "fs/promises"
import * as pdfjs from "pdfjs-dist"

// Set the worker source for PDF.js
const pdfjsWorker = "/pdf.worker.min.js"

// Ensure upload directory exists
async function ensureUploadDir() {
  const uploadDir = path.join(process.cwd(), "uploads")
  try {
    await fs.access(uploadDir)
  } catch (error) {
    await fs.mkdir(uploadDir, { recursive: true })
  }
  return uploadDir
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check file type
    const fileType = file.type
    const isTextFile = fileType === "text/plain"
    const isPdfFile = fileType === "application/pdf"

    if (!isTextFile && !isPdfFile) {
      return NextResponse.json({ error: "Only TXT and PDF files are supported" }, { status: 400 })
    }

    // Create unique filename
    const fileId = uuidv4()
    const fileExtension = isTextFile ? ".txt" : ".pdf"
    const fileName = `${fileId}${fileExtension}`

    // Ensure upload directory exists
    const uploadDir = await ensureUploadDir()
    const filePath = path.join(uploadDir, fileName)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Extract content based on file type
    let content = ""

    if (isTextFile) {
      // Read text file content
      content = buffer.toString("utf-8")
    } else if (isPdfFile) {
      // Extract text from PDF
      try {
        // Load the PDF document
        const pdfDocument = await pdfjs.getDocument({ data: buffer }).promise

        // Extract text from each page
        const numPages = pdfDocument.numPages
        const textContent = []

        for (let i = 1; i <= numPages; i++) {
          const page = await pdfDocument.getPage(i)
          const text = await page.getTextContent()
          const pageText = text.items.map((item: any) => item.str).join(" ")
          textContent.push(pageText)
        }

        content = textContent.join("\n\n")
      } catch (error) {
        console.error("Error extracting PDF text:", error)
        return NextResponse.json({ error: "Failed to extract text from PDF" }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      filePath,
      fileName: file.name,
      content,
    })
  } catch (error) {
    console.error("Error processing file upload:", error)
    return NextResponse.json({ error: "Failed to process file upload" }, { status: 500 })
  }
}
