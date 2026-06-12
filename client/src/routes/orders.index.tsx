import { createFileRoute, Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { getOrders } from "@/lib/api"
import type { OrderListEntry } from "@/lib/types"
import { cn, formatPrice } from "@/lib/utils"

export const Route = createFileRoute("/orders/")({
  component: OrdersPage,
})

function formatOrderDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr))
}

function OrdersPage() {
  const [orders, setOrders] = useState<OrderListEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-xl font-semibold text-foreground">
          My Orders
        </h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-lg border border-border bg-card"
            />
          ))}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto flex min-h-64 max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-foreground">No orders yet</h1>
        <p className="mt-2 text-muted-foreground">
          Your order history will appear here.
        </p>
        <Button variant="secondary" className="mt-6" asChild>
          <Link to="/">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold text-foreground">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const totalItems = order.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          )
          const firstImage = order.items[0]?.product.images[0]?.url
          const moreCount = order.items.length - 1

          return (
            <Link
              key={order.id}
              to="/orders/$orderId"
              params={{ orderId: String(order.id) }}
              className="block rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-4">
                  {firstImage && (
                    <div className="flex size-16 shrink-0 items-center justify-center rounded bg-muted p-1">
                      <img
                        src={firstImage}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-foreground">
                        Order #{order.id}
                      </span>
                      <span
                        className={cn(
                          "rounded-sm px-2 py-0.5 text-xs font-medium",
                          "bg-primary/10 text-primary"
                        )}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatOrderDate(order.createdAt)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {totalItems} item{totalItems !== 1 ? "s" : ""}
                      {moreCount > 0 && ` · and ${moreCount} more`}
                    </p>
                  </div>
                </div>

                <p className="font-semibold text-foreground">
                  {formatPrice(order.totalAmount)}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
