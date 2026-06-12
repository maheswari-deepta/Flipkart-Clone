import { Link } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import type { CartResponse } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

interface CartSummaryProps {
  cart: CartResponse
}

export function CartSummary({ cart }: CartSummaryProps) {
  const isEmpty = cart.items.length === 0

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-4 text-base font-semibold text-foreground">
        Price Details
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Price ({cart.totalItems} items)</span>
          <span>{formatPrice(cart.subtotal)}</span>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex justify-between font-semibold text-foreground">
            <span>Total Amount</span>
            <span>{formatPrice(cart.totalAmount)}</span>
          </div>
        </div>
      </div>

      {isEmpty ? (
        <Button variant="secondary" className="mt-4 w-full" disabled>
          Proceed to Checkout
        </Button>
      ) : (
        <Button variant="secondary" className="mt-4 w-full" asChild>
          <Link to="/checkout">Proceed to Checkout</Link>
        </Button>
      )}
    </div>
  )
}
