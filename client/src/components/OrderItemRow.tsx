import type { OrderItemDetail, OrderListItem } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

interface OrderItemRowProps {
  item: OrderItemDetail | OrderListItem
}

export function OrderItemRow({ item }: OrderItemRowProps) {
  const imageUrl = item.product.images[0]?.url
  const lineTotal = item.priceAtOrder * item.quantity

  return (
    <div className="flex gap-4 rounded-lg border border-border bg-card p-4">
      <div className="flex size-20 shrink-0 items-center justify-center rounded bg-muted p-2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.product.name}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-xs text-muted-foreground">No image</span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-foreground">
            {item.product.name}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatPrice(item.priceAtOrder)} × {item.quantity}
          </p>
        </div>

        <p className="text-sm font-semibold text-foreground">
          {formatPrice(lineTotal)}
        </p>
      </div>
    </div>
  )
}
