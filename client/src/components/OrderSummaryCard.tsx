import { formatPrice } from "@/lib/utils"

interface OrderSummaryCardProps {
  totalAmount: number
  totalItems: number
  subtotal?: number
}

export function OrderSummaryCard({
  totalAmount,
  totalItems,
  subtotal,
}: OrderSummaryCardProps) {
  const priceSubtotal = subtotal ?? totalAmount

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-4 text-base font-semibold text-foreground">
        Price Details
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Price ({totalItems} items)</span>
          <span>{formatPrice(priceSubtotal)}</span>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex justify-between font-semibold text-foreground">
            <span>Total Amount</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
