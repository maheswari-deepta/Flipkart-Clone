import { createFileRoute, useNavigate } from "@tanstack/react-router"
import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import { Star } from "lucide-react"

import { Carousel } from "@/components/Carousel"
import { SizeSelectionDialog } from "@/components/SizeSelectionDialog"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { getProductById } from "@/lib/api"
import type { Product, ProductColor } from "@/lib/types"
import { calculateDiscount, cn, formatPrice } from "@/lib/utils"

export const Route = createFileRoute("/products/$productId")({
  component: ProductDetailPage,
})

function ProductDetailPage() {
  const { productId } = Route.useParams()
  const navigate = useNavigate()
  const { addToCart, cart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [sizeDialogOpen, setSizeDialogOpen] = useState(false)

  const id = Number(productId)
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

    getProductById(id)
      .then((data) => {
        if (!cancelled) setProduct(data)
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

  const hasVariants = useMemo(() => {
    if (!product) return false
    return product.sizes.length > 0 || product.colors.length > 0
  }, [product])

  const isFashionWithVariants = useMemo(() => {
    if (!product) return false
    return product.category.name === "Fashion" && hasVariants
  }, [product, hasVariants])

  const variantInCart = useMemo(() => {
    if (!product || !cart) return false
    return cart.items.some(
      (item) =>
        item.productId === product.id &&
        item.size === (selectedSize || "") &&
        item.color === (selectedColor || "")
    )
  }, [product, cart, selectedSize, selectedColor])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid animate-pulse gap-8 md:grid-cols-2">
          <div className="aspect-square rounded-lg bg-muted" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-muted" />
            <div className="h-4 w-1/4 rounded bg-muted" />
            <div className="h-6 w-1/3 rounded bg-muted" />
            <div className="h-24 rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto flex min-h-64 max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          Product not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          The product you are looking for does not exist or has been removed.
        </p>
      </div>
    )
  }

  const discount = calculateDiscount(product.price, product.mrp)
  const inStock = product.stock > 0

  function needsVariantSelection(): boolean {
    if (!isFashionWithVariants) return false
    if (product!.sizes.length > 0 && !selectedSize) return true
    if (product!.colors.length > 0 && !selectedColor) return true
    return false
  }

  async function performAddToCart() {
    await addToCart(product!.id, 1, {
      size: selectedSize,
      color: selectedColor,
    })
  }

  async function handleAddToCart() {
    if (needsVariantSelection()) {
      setSizeDialogOpen(true)
      return
    }
    await performAddToCart()
  }

  async function handleBuyNow() {
    if (needsVariantSelection()) {
      setSizeDialogOpen(true)
      return
    }
    if (variantInCart) {
      navigate({ to: "/cart" })
      return
    }
    await performAddToCart()
    navigate({ to: "/cart" })
  }

  async function handleDialogConfirm() {
    setSizeDialogOpen(false)
    await performAddToCart()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Carousel images={product.images} productId={product.id} />

        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">
            {product.name}
          </h1>

          {product.brand && (
            <p className="text-sm text-muted-foreground">{product.brand}</p>
          )}

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-sm bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
              <Star className="size-4 fill-primary" />
              {product.rating.toFixed(1)}
            </span>
            <span
              className={cn(
                "rounded-sm px-2 py-1 text-xs font-medium",
                inStock
                  ? "bg-primary/10 text-primary"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.mrp)}
              </span>
            )}
            {discount !== null && (
              <span className="text-sm font-medium text-primary">
                {discount}% off
              </span>
            )}
          </div>

          {isFashionWithVariants && product.sizes.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "rounded border px-4 py-2 text-sm transition-colors",
                      selectedSize === size
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground hover:border-primary"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isFashionWithVariants && product.colors.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color: ProductColor) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    className={cn(
                      "flex items-center gap-2 rounded border px-3 py-2 text-sm transition-colors",
                      selectedColor === color.name
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground hover:border-primary"
                    )}
                  >
                    <span
                      className={cn(
                        "size-5 rounded-full border border-border",
                        color.token === "background" && "bg-background",
                        color.token === "primary" && "bg-primary",
                        color.token === "foreground" && "bg-foreground",
                        color.token === "accent" && "bg-accent",
                        color.token === "muted" && "bg-muted"
                      )}
                    />
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm leading-relaxed text-foreground">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            {!variantInCart && (
              <Button
                variant="secondary"
                size="lg"
                disabled={!inStock}
                onClick={handleAddToCart}
              >
                ADD TO CART
              </Button>
            )}
            <Button
              size="lg"
              disabled={!inStock}
              className="bg-accent text-accent-foreground hover:bg-accent/80"
              onClick={handleBuyNow}
            >
              BUY NOW
            </Button>
          </div>
        </div>
      </div>

      <SizeSelectionDialog
        open={sizeDialogOpen}
        onOpenChange={setSizeDialogOpen}
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        onSizeChange={setSelectedSize}
        onColorChange={setSelectedColor}
        onConfirm={handleDialogConfirm}
      />
    </div>
  )
}
