import type { Product } from "@/lib/types"

interface ProductSpecificationsProps {
  product: Product
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 gap-2 border-b border-border py-2 last:border-b-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  )
}

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const dimensions = `${product.width} × ${product.height} × ${product.depth} cm`

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold text-foreground">
        Specifications
      </h2>
      <dl>
        <SpecRow label="SKU" value={product.sku} />
        <SpecRow label="Weight" value={`${product.weight} kg`} />
        <SpecRow label="Dimensions (W × H × D)" value={dimensions} />
        <SpecRow label="Warranty" value={product.warranty} />
        <SpecRow label="Shipping" value={product.shippingInfo} />
        <SpecRow label="Return Policy" value={product.returnPolicy} />
        <SpecRow
          label="Minimum Order"
          value={`${product.minOrderQty} unit${product.minOrderQty === 1 ? "" : "s"}`}
        />
      </dl>
    </section>
  )
}
