import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Loader2, Minus, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import type { CartItemDTO } from "@/lib/types"
import { cn, formatPrice } from "@/lib/utils"

interface CartItemRowProps {
  item: CartItemDTO
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart()
  const [removing, setRemoving] = useState(false)
  const [updating, setUpdating] = useState(false)
  const { product, quantity } = item
  const imageUrl = product.images[0]?.url
  const minQty = product.minOrderQty ?? 1
  const atMaxStock = quantity >= product.stock
  const atMinQty = quantity <= minQty
  const lineTotal = product.price * quantity

  async function handleQuantityChange(newQty: number) {
    if (updating || removing) return

    setUpdating(true)
    try {
      await updateQuantity(item.id, newQty)
    } finally {
      setUpdating(false)
    }
  }

  async function handleRemove() {
    if (removing) return

    setRemoving(true)
    try {
      await removeItem(item.id)
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div
      className={cn(
        "flex gap-4 rounded-lg border border-border bg-card p-4 transition-opacity",
        (updating || removing) && "opacity-60"
      )}
    >
      <div className="flex size-24 shrink-0 items-center justify-center rounded bg-muted p-2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-xs text-muted-foreground">No image</span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <Link
          to="/products/$productId"
          params={{ productId: String(product.id) }}
          className="text-sm font-medium text-foreground hover:text-primary"
        >
          {product.name}
        </Link>

        {(item.size || item.color) && (
          <p className="text-xs text-muted-foreground">
            {[item.size, item.color].filter(Boolean).join(" · ")}
          </p>
        )}

        <p className="text-sm text-muted-foreground">
          {formatPrice(product.price)}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={atMinQty || updating || removing}
              aria-label="Decrease quantity"
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="w-8 text-center text-sm font-medium text-foreground">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={atMaxStock || updating || removing}
              aria-label="Increase quantity"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>

          {atMaxStock && (
            <span className="text-xs text-muted-foreground">
              Max stock reached
            </span>
          )}

          {minQty > 1 && (
            <span className="text-xs text-muted-foreground">
              Min qty: {minQty}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">
          {formatPrice(lineTotal)}
        </p>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleRemove}
          disabled={removing || updating}
          aria-label="Remove item"
          aria-busy={removing}
          className="text-muted-foreground hover:text-destructive disabled:pointer-events-none disabled:opacity-40"
        >
          {removing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
