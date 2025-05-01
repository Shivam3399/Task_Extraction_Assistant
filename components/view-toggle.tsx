"use client"
import { LayoutGrid, List } from "lucide-react"

interface ViewToggleProps {
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center border rounded-md overflow-hidden">
      <button
        className={`px-2 sm:px-3 py-1.5 ${view === "grid" ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" : "bg-transparent"}`}
        onClick={() => onViewChange("grid")}
        title="Grid View"
        aria-label="Grid View"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>

      <button
        className={`px-2 sm:px-3 py-1.5 ${view === "list" ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" : "bg-transparent"}`}
        onClick={() => onViewChange("list")}
        title="List View"
        aria-label="List View"
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  )
}
