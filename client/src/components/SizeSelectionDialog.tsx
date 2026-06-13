import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Product, ProductColor } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface SizeSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
  selectedSize: string
  selectedColor: string
  onSizeChange: (size: string) => void
  onColorChange: (color: string) => void
  onConfirm: () => void
  confirming?: boolean
}

export function SizeSelectionDialog({
  open,
  onOpenChange,
  product,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
  onConfirm,
  confirming = false,
}: SizeSelectionDialogProps) {
  const imageUrl = product.images[0]?.url
  const needsSize = product.sizes.length > 0
  const needsColor = product.colors.length > 0
  const canConfirm =
    (!needsSize || selectedSize !== "") &&
    (!needsColor || selectedColor !== "")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select options</DialogTitle>
          <DialogDescription>
            Choose size and color before adding to cart.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4">
          {imageUrl && (
            <div className="flex size-24 shrink-0 items-center justify-center rounded border border-border bg-muted p-2">
              <img
                src={imageUrl}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}
          <div className="flex-1 space-y-4">
            <p className="text-sm font-medium text-foreground">{product.name}</p>

            {needsSize && (
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => onSizeChange(size)}
                      className={cn(
                        "rounded border px-3 py-1.5 text-sm transition-colors",
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

            {needsColor && (
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Color
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color: ProductColor) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => onColorChange(color.name)}
                      className={cn(
                        "flex items-center gap-1.5 rounded border px-2 py-1 text-sm transition-colors",
                        selectedColor === color.name
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-foreground hover:border-primary"
                      )}
                    >
                      <span
                        className={cn(
                          "size-4 rounded-full border border-border",
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
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full bg-accent text-accent-foreground hover:bg-accent/80"
            disabled={!canConfirm || confirming}
            onClick={onConfirm}
          >
            {confirming ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add to Cart"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
