import * as React from "react"
import { Search, ChevronDown } from 'lucide-react'
import { cn } from "../../lib/utils"

const Combobox = React.forwardRef(
  ({ className, options = [], value, onValueChange, placeholder, groupedOptions, renderOption, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const containerRef = React.useRef(null)
    const inputRef = React.useRef(null)

    // Handle click outside
    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside, true)
      return () => document.removeEventListener('mousedown', handleClickOutside, true)
    }, [])

    // Convert flat options to grouped format if needed
    const getDisplayOptions = () => {
      if (groupedOptions) {
        if (!search) return groupedOptions
        return groupedOptions.map(group => ({
          ...group,
          items: group.items.filter(item =>
            item.label.toLowerCase().includes(search.toLowerCase())
          )
        })).filter(group => group.items.length > 0)
      }
      
      // Flat options mode - for Variant selector
      const filtered = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
      return [{
        label: '',
        items: filtered
      }]
    }

    const displayOptions = getDisplayOptions()
    const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder

    return (
      <div ref={containerRef} className="relative w-full">
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <span className="text-foreground">{selectedLabel}</span>
          <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <div className="absolute top-full left-0 z-50 mt-1 rounded-[var(--border-radius-lg,8px)] border border-[var(--base-border,#E4E4E7)] bg-[var(--base-background,#FFF)] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-2px_rgba(0,0,0,0.05)] min-w-[300px]">
            {/* Search Input */}
            <div className="border-b border-input p-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={`Search ${placeholder?.toLowerCase() ?? 'options'}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  autoFocus
                />
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-64 overflow-y-auto">
              {displayOptions && displayOptions.length > 0 && displayOptions[0].items.length > 0 ? (
                displayOptions.map((group) => (
                  <div key={group.label || 'options'}>
                    {group.label && (
                      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/30">
                        {group.label}
                      </div>
                    )}
                    {group.items.map((item) => (
                      <button
                        key={item.value}
                        onClick={() => {
                          onValueChange(item.value)
                          setOpen(false)
                          setSearch('')
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-center gap-2",
                          value === item.value && "bg-accent text-accent-foreground"
                        )}
                      >
                        {value === item.value && <span className="text-lg leading-none">✓</span>}
                        {renderOption ? renderOption(item) : item.label}
                      </button>
                    ))}
                  </div>
                ))
              ) : (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
)

Combobox.displayName = "Combobox"

export { Combobox }
