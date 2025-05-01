import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST() {
  try {
    console.log("Starting dependency installation...")

    // Check if Python is available
    try {
      await execAsync("python --version")
    } catch (error) {
      return NextResponse.json(
        {
          error: "Python is not installed on this system. Please install Python before continuing.",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      )
    }

    // Install required packages
    console.log("Installing Python packages...")
    const packages = ["nltk", "spacy", "dateparser", "tabulate"]

    for (const pkg of packages) {
      try {
        console.log(`Installing ${pkg}...`)
        await execAsync(`pip install ${pkg}`)
      } catch (error) {
        return NextResponse.json(
          {
            error: `Failed to install ${pkg}. Please try installing manually.`,
            details: error instanceof Error ? error.message : String(error),
          },
          { status: 500 },
        )
      }
    }

    // Install spaCy model
    try {
      console.log("Installing spaCy English model...")
      await execAsync("python -m spacy download en_core_web_sm")
    } catch (error) {
      return NextResponse.json(
        {
          error: "Failed to install spaCy English model. Please try installing manually.",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      )
    }

    console.log("All dependencies installed successfully!")
    return NextResponse.json({ success: true, message: "Dependencies installed successfully" })
  } catch (error) {
    console.error("Error during installation:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred during installation.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
