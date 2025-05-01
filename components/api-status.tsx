"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, AlertCircle, ArrowUpCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ApiStatus() {
  const [status, setStatus] = useState<"loading" | "available" | "unavailable">("loading")
  const [isInstalling, setIsInstalling] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const checkApiStatus = async () => {
    try {
      const response = await fetch("/api/extract-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: "Test API" }),
      })

      const data = await response.json()

      if (data.fallback || !response.ok) {
        setStatus("unavailable")
      } else {
        setStatus("available")
      }
    } catch (error) {
      setStatus("unavailable")
    }
  }

  useEffect(() => {
    checkApiStatus()
  }, [])

  const handleInstallDependencies = async () => {
    console.log("Starting installation process...")
    setIsInstalling(true)

    try {
      const response = await fetch("/api/install-dependencies", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Installation complete",
          description: "Advanced NLP dependencies have been installed successfully.",
        })
        // Re-check API status
        await checkApiStatus()
      } else {
        toast({
          title: "Installation failed",
          description: data.error || "Failed to install dependencies.",
          variant: "destructive",
        })
        console.error("Installation failed:", data.error, data.details)
      }
    } catch (error) {
      console.error("Installation error:", error)
      toast({
        title: "Installation failed",
        description: "An error occurred during installation.",
        variant: "destructive",
      })
    } finally {
      setIsInstalling(false)
      setIsDialogOpen(false)
    }
  }

  const openInstallDialog = () => {
    console.log("Opening installation dialog")
    setIsDialogOpen(true)
  }

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              {status === "loading" && (
                <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                  Checking API...
                </Badge>
              )}
              {status === "available" && (
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  <Check className="h-3 w-3 mr-1" /> Advanced NLP Active
                </Badge>
              )}
              {status === "unavailable" && (
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                >
                  <AlertCircle className="h-3 w-3 mr-1" /> Basic NLP Mode
                </Badge>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {status === "loading" && "Checking if advanced NLP features are available..."}
            {status === "available" && "Using advanced Python NLP with spaCy, Word2Vec, and LDA"}
            {status === "unavailable" &&
              "Using JavaScript fallback for task extraction. Click upgrade to install advanced features."}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {status === "unavailable" && (
        <>
          <Button variant="outline" size="sm" className="ml-2 h-7" onClick={openInstallDialog}>
            <ArrowUpCircle className="h-3 w-3 mr-1" /> Upgrade
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upgrade to Advanced NLP</DialogTitle>
                <DialogDescription>
                  To use advanced NLP features, you need to install Python and required packages.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-4">
                <div className="rounded-md bg-amber-50 p-4 dark:bg-amber-900/20">
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-500">Installation Options</h3>
                  <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                    <p className="mb-2">Choose the option that works best for you:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>
                        <strong>Automatic Installation (Recommended):</strong> Let us install the required packages for
                        you.
                      </li>
                      <li>
                        <strong>Manual Installation:</strong> If automatic installation fails, you can install the
                        packages manually.
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-800/50">
                  <h3 className="text-sm font-medium">Manual Installation Steps</h3>
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    <p>If you prefer to install manually, run these commands in your terminal:</p>
                    <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto text-xs">
                      pip install nltk spacy dateparser tabulate
                      <br />
                      python -m spacy download en_core_web_sm
                    </pre>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInstallDependencies} disabled={isInstalling}>
                  {isInstalling ? "Installing..." : "Install Automatically"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
