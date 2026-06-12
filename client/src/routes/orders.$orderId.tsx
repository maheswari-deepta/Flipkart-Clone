import { createFileRoute } from "@tanstack/react-router"
import axios from "axios"
import { CheckCircle, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

import { OrderItemRow } from "@/components/OrderItemRow"
import { OrderSummaryCard } from "@/components/OrderSummaryCard"
import { getOrderById } from "@/lib/api"
import type { Order } from "@/lib/types"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/orders/$orderId")({
  component: OrderDetailPage,
})

function formatOrderDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr))
}

function OrderDetailPage() {
  const { orderId } = Route.useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const id = Number(orderId)
  const invalidId = Number.isNaN(id)

  useEffect(() => {
    if (invalidId) {
      setLoading(false)
      setNotFound(true)
      return
    }

    let cancelled = false
    setLoading(true)
    setNotFound(false)

    getOrderById(id)
      .then((data) => {
        if (!cancelled) setOrder(data)
      })
      .catch((err) => {
        if (!cancelled) {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            setNotFound(true)
          } else {
            setNotFound(true)
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id, invalidId])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 h-16 animate-pulse rounded-lg bg-muted" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg border border-border bg-card"
            />
          ))}
        </div>
      </div>
    )
  }

  if (notFound || !order) {
    return (
      <div className="mx-auto flex min-h-64 max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          Order not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          The order you are looking for does not exist.
        </p>
      </div>
    )
  }

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3 rounded-lg bg-accent/10 px-4 py-3 text-accent-foreground">
        <CheckCircle className="size-6 shrink-0 text-accent" />
        <span className="font-semibold">Order Placed Successfully!</span>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold text-foreground">
          Order #{order.id}
        </h1>
        <span
          className={cn(
            "rounded-sm px-2 py-1 text-xs font-medium",
            "bg-primary/10 text-primary"
          )}
        >
          {order.status}
        </span>
        <span className="text-sm text-muted-foreground">
          {formatOrderDate(order.createdAt)}
        </span>
      </div>

      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <div className="mb-2 flex items-center gap-2">
          <MapPin className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            Delivery Address
          </h2>
        </div>
        <p className="text-sm font-medium text-foreground">
          {order.shippingName}
        </p>
        <p className="text-sm text-muted-foreground">
          {order.shippingAddress}
        </p>
        <p className="text-sm text-muted-foreground">
          {order.shippingCity} - {order.shippingPincode}
        </p>
        <p className="text-sm text-muted-foreground">{order.shippingPhone}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          {order.items.map((item) => (
            <OrderItemRow key={item.id} item={item} />
          ))}
        </div>

        <div>
          <OrderSummaryCard
            totalAmount={order.totalAmount}
            totalItems={totalItems}
          />
        </div>
      </div>
    </div>
  )
}
