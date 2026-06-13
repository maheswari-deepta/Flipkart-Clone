import { Star } from "lucide-react"

import type { Review } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ProductReviewsProps {
  reviews: Review[]
}

function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Customer Reviews ({reviews.length})
      </h2>

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="border-b border-border pb-4 last:border-b-0 last:pb-0"
            >
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-3.5",
                        i < review.rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/40"
                      )}
                    />
                  ))}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {review.reviewerName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatReviewDate(review.createdAt)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-foreground">
                {review.comment}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
