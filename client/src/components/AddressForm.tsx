import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CreateOrderRequest } from "@/lib/types"
import { cn } from "@/lib/utils"

interface AddressFormProps {
  values: CreateOrderRequest
  onChange: (field: keyof CreateOrderRequest, value: string) => void
  errors: Partial<Record<keyof CreateOrderRequest, string>>
}

const fields: {
  key: keyof CreateOrderRequest
  label: string
  placeholder: string
  type?: string
}[] = [
  {
    key: "email",
    label: "Email",
    placeholder: "Enter your email address",
    type: "email",
  },
  { key: "shippingName", label: "Full Name", placeholder: "Enter your full name" },
  {
    key: "shippingPhone",
    label: "Phone",
    placeholder: "10-digit mobile number",
    type: "tel",
  },
  {
    key: "shippingAddress",
    label: "Address",
    placeholder: "House no., street, area",
  },
  { key: "shippingCity", label: "City", placeholder: "Enter city" },
  {
    key: "shippingPincode",
    label: "Pincode",
    placeholder: "6-digit pincode",
    type: "tel",
  },
]

export function AddressForm({ values, onChange, errors }: AddressFormProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-4 text-base font-semibold text-foreground">
        Delivery Address
      </h2>

      <div className="space-y-4">
        {fields.map(({ key, label, placeholder, type }) => (
          <div key={key} className="space-y-1.5">
            <Label htmlFor={key}>{label}</Label>
            {key === "shippingAddress" ? (
              <textarea
                id={key}
                value={values[key]}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder={placeholder}
                rows={3}
                aria-invalid={Boolean(errors[key])}
                className={cn(
                  "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30",
                  errors[key] &&
                    "border-destructive ring-3 ring-destructive/20"
                )}
              />
            ) : (
              <Input
                id={key}
                type={type ?? "text"}
                value={values[key]}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder={placeholder}
                aria-invalid={Boolean(errors[key])}
              />
            )}
            {errors[key] && (
              <p className="text-xs text-destructive">{errors[key]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
