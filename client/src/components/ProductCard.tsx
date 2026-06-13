import { Link } from "@tanstack/react-router"
import { Star } from "lucide-react"

import { WishlistImageButton } from "@/components/WishlistImageButton"
import type { Product } from "@/lib/types"
import { calculateDiscount, cn, formatPrice } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = calculateDiscount(product.price, product.mrp)
  const imageUrl = product.images[0]?.url
  const isHotDeal = discount !== null && discount >= 50
  const sizesLine =
    product.sizes.length > 0
      ? `Size ${product.sizes.join(", ")}`
      : null
  const reviewCount =
    product._count?.reviews ?? product.reviews?.length ?? 0

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[3/4] bg-muted">
        <Link
          to="/products/$productId"
          params={{ productId: String(product.id) }}
          className="flex h-full items-center justify-center p-3"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="text-sm text-muted-foreground">No image</div>
          )}
        </Link>

        <div className="absolute top-2 right-2 z-10">
          <WishlistImageButton productId={product.id} />
        </div>
      </div>

      <Link
        to="/products/$productId"
        params={{ productId: String(product.id) }}
        className="flex flex-1 flex-col gap-1 p-3"
      >
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {product.name}
        </h3>

        {product.brand && (
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {product.brand}
          </p>
        )}

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3 fill-primary text-primary" />
          <span>{product.rating.toFixed(1)}</span>
          <span>
            ({reviewCount} review
            {reviewCount === 1 ? "" : "s"})
          </span>
        </div>

        {product.availability !== "In Stock" && (
          <span
            className={cn(
              "inline-flex w-fit rounded-sm px-1.5 py-0.5 text-xs font-medium",
              "bg-destructive/10 text-destructive"
            )}
          >
            {product.availability}
          </span>
        )}

        <div className="mt-auto flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 pt-1">
          <span className="text-base font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.mrp > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.mrp)}
            </span>
          )}
          {discount !== null && (
            <span className="text-xs font-medium text-accent">
              {discount}% off
            </span>
          )}
        </div>

        {isHotDeal && (
          <span className="mt-1 inline-flex w-fit rounded-sm bg-accent px-1.5 py-0.5 text-xs font-medium text-accent-foreground">
            Hot Deal
          </span>
        )}

        {sizesLine && (
          <p className="mt-1 text-xs text-muted-foreground">{sizesLine}</p>
        )}
      </Link>
    </article>
  )
}
