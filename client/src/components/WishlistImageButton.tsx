import { useState } from "react"
import { Heart } from "lucide-react"

import { useWishlist } from "@/context/WishlistContext"
import { cn } from "@/lib/utils"

interface WishlistImageButtonProps {
  productId: number
  className?: string
}

export function WishlistImageButton({
  productId,
  className,
}: WishlistImageButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [pending, setPending] = useState(false)
  const wished = isInWishlist(productId)

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (pending) return

    setPending(true)
    try {
      await toggleWishlist(productId)
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "flex size-10 items-center justify-center rounded-sm border border-border bg-card shadow-md transition-colors hover:bg-muted disabled:opacity-60",
        className
      )}
    >
      <Heart
        className={cn(
          "size-5 text-foreground",
          wished && "fill-destructive text-destructive"
        )}
      />
    </button>
  )
}
