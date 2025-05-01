"use client"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TaskFiltersProps {
  onSortChange: (sort: string) => void
  currentSort: string
}

export function TaskFilters({ onSortChange, currentSort }: TaskFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            Sort by
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Sort Tasks</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={currentSort} onValueChange={onSortChange}>
            <DropdownMenuRadioItem value="category">By Category</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="deadline">By Deadline</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="person">By Person</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
