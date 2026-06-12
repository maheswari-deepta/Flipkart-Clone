import { createFileRoute, Link } from "@tanstack/react-router"

import { CartItemRow } from "@/components/CartItemRow"
import { CartSummary } from "@/components/CartSummary"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"

export const Route = createFileRoute("/cart")({
  component: CartPage,
})

function CartPage() {
  const { cart, loading, error, refreshCart } = useCart()

  if (loading && !cart) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-xl font-semibold text-foreground">
          My Cart
        </h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex animate-pulse gap-4 rounded-lg border border-border bg-card p-4"
            >
              <div className="size-24 rounded bg-muted" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-4 w-1/4 rounded bg-muted" />
                <div className="h-8 w-24 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error && !cart) {
    return (
      <div className="mx-auto flex min-h-64 max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" className="mt-4" onClick={refreshCart}>
          Retry
        </Button>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto flex min-h-64 max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Your cart is empty
        </h1>
        <p className="mt-2 text-muted-foreground">
          Add items to your cart to see them here.
        </p>
        <Button variant="secondary" className="mt-6" asChild>
          <Link to="/">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold text-foreground">My Cart</h1>

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={refreshCart}>
            Retry
          </Button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          {cart.items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>

        <div>
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}
