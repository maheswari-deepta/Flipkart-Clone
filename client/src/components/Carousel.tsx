import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import { WishlistImageButton } from "@/components/WishlistImageButton"
import type { ProductImage } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CarouselProps {
  images: ProductImage[]
  productId?: number
}

export function Carousel({ images, productId }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const goTo = useCallback(
    (index: number) => {
      if (images.length === 0) return
      const wrapped =
        ((index % images.length) + images.length) % images.length
      setActiveIndex(wrapped)
    },
    [images.length]
  )

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  useEffect(() => {
    if (!lightboxOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false)
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxOpen, goPrev, goNext])

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
        <span className="text-muted-foreground">No image available</span>
      </div>
    )
  }

  const activeImage = images[activeIndex]

  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="flex aspect-square w-full cursor-zoom-in items-center justify-center rounded-lg border border-border bg-card p-6"
            aria-label="Open image gallery"
          >
            <img
              src={activeImage.url}
              alt={`Product image ${activeIndex + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          </button>

          {productId !== undefined && (
            <div className="absolute top-3 right-3 z-10">
              <WishlistImageButton productId={productId} />
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "flex size-16 shrink-0 items-center justify-center rounded border p-1 transition-colors",
                  index === activeIndex
                    ? "border-primary"
                    : "border-border hover:border-muted-foreground"
                )}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 rounded-full bg-card p-2 text-foreground shadow-md hover:bg-muted"
            aria-label="Close gallery"
          >
            <X className="size-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goPrev()
                }}
                className="absolute left-4 rounded-full bg-card p-2 text-foreground shadow-md hover:bg-muted"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goNext()
                }}
                className="absolute right-4 rounded-full bg-card p-2 text-foreground shadow-md hover:bg-muted"
                aria-label="Next image"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}

          <div
            className="flex max-h-[85vh] max-w-[90vw] items-center justify-center p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage.url}
              alt={`Product image ${activeIndex + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveIndex(index)
                  }}
                  className={cn(
                    "size-2.5 rounded-full transition-colors",
                    index === activeIndex
                      ? "bg-primary"
                      : "bg-muted-foreground/40 hover:bg-muted-foreground"
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
