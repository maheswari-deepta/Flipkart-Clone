import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useRouterState } from "@tanstack/react-router"
import {
  Heart,
  LayoutGrid,
  Loader2,
  Package,
  Plus,
  Search,
  ShoppingCart,
} from "lucide-react"

import { useCart } from "@/context/CartContext"
import { useWishlist } from "@/context/WishlistContext"
import { useDebounce } from "@/hooks/useDebounce"
import { getCategories, getProducts } from "@/lib/api"
import type { Category, Product } from "@/lib/types"
import {
  cn,
  getCategoryIcon,
  parseCategoryParam,
} from "@/lib/utils"

interface SuggestionItem {
  type: "category" | "product"
  id: number
  label: string
  productId?: number
}

export function Navbar() {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { search: currentSearch, category } = useRouterState({
    select: (s) => {
      if (s.location.pathname !== "/") {
        return { search: undefined, category: undefined }
      }
      const params = s.location.search as {
        search?: string
        category?: string
      }
      return { search: params.search, category: params.category }
    },
  })
  const selectedCategories = parseCategoryParam(category)
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const [query, setQuery] = useState(currentSearch ?? "")
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([])
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const skipSearchSyncRef = useRef(false)
  const debouncedQuery = useDebounce(query, 400)

  useEffect(() => {
    getCategories()
      .then(setAllCategories)
      .finally(() => setCategoriesLoading(false))
  }, [])

  useEffect(() => {
    if (pathname === "/") {
      setQuery(currentSearch ?? "")
    }
  }, [pathname, currentSearch])

  useEffect(() => {
    if (pathname !== "/") {
      skipSearchSyncRef.current = false
      return
    }

    if (skipSearchSyncRef.current) {
      if (debouncedQuery === "") {
        skipSearchSyncRef.current = false
      }
      return
    }

    navigate({
      to: "/",
      search: {
        search: debouncedQuery.trim() || undefined,
        category,
      },
      replace: true,
    })
  }, [debouncedQuery, pathname, category, navigate])

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setSuggestions([])
      setSearchLoading(false)
      return
    }

    let cancelled = false
    const term = trimmed.toLowerCase()
    setSearchLoading(true)

    const matchingCategories: SuggestionItem[] = allCategories
      .filter((c) => c.name.toLowerCase().includes(term))
      .slice(0, 3)
      .map((c) => ({
        type: "category" as const,
        id: c.id,
        label: c.name,
      }))

    getProducts({ search: trimmed, limit: 6 })
      .then((products: Product[]) => {
        if (cancelled) return

        const productSuggestions: SuggestionItem[] = products.map((p) => ({
          type: "product" as const,
          id: p.id,
          label: p.name,
          productId: p.id,
        }))

        setSuggestions([...matchingCategories, ...productSuggestions].slice(0, 6))
      })
      .catch(() => {
        if (!cancelled) setSuggestions(matchingCategories)
      })
      .finally(() => {
        if (!cancelled) setSearchLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [query, allCategories])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSuggestionsOpen(false)
        setActiveSuggestion(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleSuggestionSelect(item: SuggestionItem) {
    setSuggestionsOpen(false)
    setActiveSuggestion(-1)

    if (item.type === "category") {
      setQuery("")
      navigate({
        to: "/",
        search: { category: item.label },
      })
    } else if (item.productId) {
      setQuery("")
      navigate({
        to: "/products/$productId",
        params: { productId: String(item.productId) },
      })
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!suggestionsOpen || suggestions.length === 0) {
      if (e.key === "Escape") setSuggestionsOpen(false)
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveSuggestion((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveSuggestion((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      )
    } else if (e.key === "Enter" && activeSuggestion >= 0) {
      e.preventDefault()
      handleSuggestionSelect(suggestions[activeSuggestion])
    } else if (e.key === "Escape") {
      setSuggestionsOpen(false)
      setActiveSuggestion(-1)
    }
  }

  function clearSearchInput() {
    skipSearchSyncRef.current = true
    setQuery("")
    setSuggestionsOpen(false)
    setActiveSuggestion(-1)
  }

  function handleHomeClick(e: React.MouseEvent) {
    e.preventDefault()
    clearSearchInput()
    navigate({ to: "/", search: {}, replace: true })
  }

  function handleForYouClick() {
    clearSearchInput()
    navigate({ to: "/", search: {} })
  }

  function handleCategoryNavClick(catName: string) {
    clearSearchInput()
    navigate({
      to: "/",
      search: { category: catName },
    })
  }

  const isForYouActive =
    pathname === "/" && selectedCategories.length === 0

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Row 1 — primary bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5 sm:gap-6">
          {/* Logo */}
          <Link
            to="/"
            search={{}}
            onClick={handleHomeClick}
            className="group shrink-0 hover:opacity-90"
          >
            <div className="rounded-sm bg-secondary px-2 py-0.5">
              <span className="text-lg font-bold italic text-primary">
                Flipkart
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-0.5 text-xs italic">
              <span className="text-primary-foreground/90">Explore</span>
              <Plus className="size-3 text-secondary" />
              <span className="text-secondary">Plus</span>
            </div>
          </Link>

          {/* Search */}
          <div ref={containerRef} className="relative min-w-0 flex-1">
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSuggestionsOpen(true)
                  setActiveSuggestion(-1)
                }}
                onFocus={() => setSuggestionsOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search for products, brands and more"
                className="w-full rounded-sm bg-background py-2 pr-12 pl-4 text-sm text-foreground outline-none"
              />
              <button
                type="button"
                className="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center rounded-sm bg-primary text-primary-foreground"
                aria-label="Search"
              >
                {searchLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Search className="size-4" />
                )}
              </button>

              {suggestionsOpen && query.trim() && searchLoading && (
                <ul className="absolute top-full right-0 left-0 z-50 mt-1 rounded-sm border border-border bg-popover shadow-lg">
                  <li className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Searching...
                  </li>
                </ul>
              )}

              {suggestionsOpen && suggestions.length > 0 && !searchLoading && (
                <ul className="absolute top-full right-0 left-0 z-50 mt-1 max-h-72 overflow-y-auto rounded-sm border border-border bg-popover shadow-lg">
                  {suggestions.map((item, index) => (
                    <li key={`${item.type}-${item.id}`}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSuggestionSelect(item)}
                        className={cn(
                          "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-popover-foreground hover:bg-muted",
                          index === activeSuggestion && "bg-muted"
                        )}
                      >
                        <span className="shrink-0 text-xs font-medium uppercase text-muted-foreground">
                          {item.type === "category" ? "Category" : "Product"}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <Link
              to="/orders"
              className="flex items-center gap-1.5 text-sm font-medium hover:opacity-90"
            >
              <Package className="size-5" />
              <span className="hidden sm:inline">Orders</span>
            </Link>

            <Link
              to="/wishlist"
              className="relative flex items-center gap-1.5 text-sm font-medium hover:opacity-90"
            >
              <span className="relative">
                <Heart className="size-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {wishlistCount}
                  </span>
                )}
              </span>
              <span className="hidden sm:inline">Wishlist</span>
            </Link>

            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 text-sm font-medium hover:opacity-90"
            >
              <span className="relative">
                <ShoppingCart className="size-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="hidden sm:inline">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Row 2 — category nav */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl overflow-x-auto px-2 no-scrollbar">
          <nav className="flex items-stretch gap-1 py-1 sm:gap-2">
            <button
              type="button"
              onClick={handleForYouClick}
              className={cn(
                "flex shrink-0 flex-col items-center gap-1 px-3 py-2 text-xs transition-colors",
                isForYouActive
                  ? "border-b-2 border-primary text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              <LayoutGrid className="size-5" />
              <span className="whitespace-nowrap">For You</span>
            </button>

            {categoriesLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex shrink-0 flex-col items-center gap-1 px-3 py-2"
                  >
                    <div className="size-5 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                  </div>
                ))
              : allCategories.map((cat) => {
              const Icon = getCategoryIcon(cat.name)
              const isActive = selectedCategories.includes(cat.name)

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryNavClick(cat.name)}
                  className={cn(
                    "flex shrink-0 flex-col items-center gap-1 px-3 py-2 text-xs transition-colors",
                    isActive
                      ? "border-b-2 border-primary text-primary"
                      : "text-foreground hover:text-primary"
                  )}
                >
                  <Icon className="size-5" />
                  <span className="max-w-20 truncate whitespace-nowrap sm:max-w-none">
                    {cat.name}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
