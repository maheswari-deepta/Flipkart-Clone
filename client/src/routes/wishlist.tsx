import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"
import { Loader2 } from "lucide-react"

import { ProductCard } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/context/WishlistContext"

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
})

function WishlistPage() {
  const { wishlist, loading, error, refreshWishlist } = useWishlist()
  const [refreshing, setRefreshing] = useState(false)

  async function handleRetry() {
    setRefreshing(true)
    try {
      await refreshWishlist({ showLoading: true })
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="mb-6 text-xl font-semibold text-foreground">
          My Wishlist
        </h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-sm border border-border bg-card"
            >
              <div className="aspect-[3/4] bg-muted" />
              <div className="space-y-2 p-3">
                <div className="h-4 rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-6 w-1/2 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-destructive">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          disabled={refreshing}
          onClick={handleRetry}
        >
          {refreshing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Retrying...
            </>
          ) : (
            "Retry"
          )}
        </Button>
      </div>
    )
  }

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto flex min-h-64 max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Your wishlist is empty
        </h1>
        <p className="mt-2 text-muted-foreground">
          Save items you like by clicking the heart icon on any product.
        </p>
        <Link
          to="/"
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-6 text-xl font-semibold text-foreground">
        My Wishlist ({wishlist.length})
      </h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
