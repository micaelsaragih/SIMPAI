"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { SearchIcon, XIcon } from "lucide-react"

interface TemplateSearchProps {
  value: string
  onChange: (value: string) => void
}

export function TemplateSearch({ value, onChange }: TemplateSearchProps) {
  const [localValue, setLocalValue] = useState(value)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  // Sync with prop value if it changes externally
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounced effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onChangeRef.current(localValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [localValue])

  return (
    <div className="relative w-full">
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors" />
      <Input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Cari nama template atau publisher..."
        className="pl-9 pr-9 w-full bg-background border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
      />
      {localValue && (
        <button
          onClick={() => setLocalValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full hover:bg-muted"
          type="button"
          aria-label="Hapus pencarian"
        >
          <XIcon className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
