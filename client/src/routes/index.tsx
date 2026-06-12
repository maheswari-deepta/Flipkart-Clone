import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { SlidersHorizontal } from "lucide-react"

import { FilterSidebar } from "@/components/FilterSidebar"
import { ProductCard } from "@/components/ProductCard"
import { getProducts } from "@/lib/api"
import type { HomeSearchParams, Product } from "@/lib/types"
import { cn, parseCategoryParam } from "@/lib/utils"

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): HomeSearchParams => ({
    search:
      typeof search.search === "string" && search.search
        ? search.search
        : undefined,
    category:
      typeof search.category === "string" && search.category
        ? search.category
        : undefined,
  }),
  component: HomePage,
})

function HomePage() {
  const { search, category } = Route.useSearch()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    getProducts({ search, category: parseCategoryParam(category) })
      .then((data) => {
        if (!cancelled) setProducts(data)
      })
      .catch(() => {
        if (!cancelled) setProducts([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [search, category])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <button
        type="button"
        onClick={() => setFiltersOpen((open) => !open)}
        className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground md:hidden"
      >
        <SlidersHorizontal className="size-4" />
        Filters
      </button>

      <div className="flex gap-6">
        <div
          className={cn(
            "md:block",
            filtersOpen ? "block" : "hidden"
          )}
        >
          <FilterSidebar />
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-lg border border-border bg-card"
                >
                  <div className="aspect-square bg-muted" />
                  <div className="space-y-2 p-3">
                    <div className="h-4 rounded bg-muted" />
                    <div className="h-4 w-2/3 rounded bg-muted" />
                    <div className="h-6 w-1/2 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex min-h-48 items-center justify-center text-muted-foreground">
              No products found
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
