"use client"
import { LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ViewToggleProps {
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center border rounded-md overflow-hidden">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 rounded-none ${view === "grid" ? "bg-primary/10 text-primary" : "bg-transparent"}`}
              onClick={() => onViewChange("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Grid View</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 rounded-none ${view === "list" ? "bg-primary/10 text-primary" : "bg-transparent"}`}
              onClick={() => onViewChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>List View</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
