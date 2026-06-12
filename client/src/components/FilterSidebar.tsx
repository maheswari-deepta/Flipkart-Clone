import { useEffect, useState } from "react"
import { useNavigate, useSearch } from "@tanstack/react-router"

import { getCategories } from "@/lib/api"
import type { Category } from "@/lib/types"
import {
  parseCategoryParam,
  serializeCategoryParam,
} from "@/lib/utils"

export function FilterSidebar() {
  const navigate = useNavigate()
  const { search, category } = useSearch({ from: "/" })
  const selectedCategories = parseCategoryParam(category)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  function handleCategoryChange(name: string, checked: boolean) {
    const next = checked
      ? [...selectedCategories, name]
      : selectedCategories.filter((c) => c !== name)

    navigate({
      to: "/",
      search: (prev) => ({
        ...prev,
        category: serializeCategoryParam(next),
      }),
    })
  }

  function clearFilters() {
    navigate({
      to: "/",
      search: {},
    })
  }

  const hasFilters = Boolean(search || selectedCategories.length > 0)

  return (
    <aside className="w-full shrink-0 md:w-56">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Categories</h2>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-4 animate-pulse rounded bg-muted"
              />
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.id}>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.name)}
                    onChange={(e) =>
                      handleCategoryChange(cat.name, e.target.checked)
                    }
                    className="accent-primary"
                  />
                  {cat.name}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
