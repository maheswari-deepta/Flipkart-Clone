import { createFileRoute, useNavigate } from "@tanstack/react-router"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { AddressForm } from "@/components/AddressForm"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { placeOrder } from "@/lib/api"
import type { ApiError, CreateOrderRequest } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
})

const emptyAddress: CreateOrderRequest = {
  email: "",
  shippingName: "",
  shippingPhone: "",
  shippingAddress: "",
  shippingCity: "",
  shippingPincode: "",
}

type CheckoutStep = "address" | "review"

function validateAddress(
  values: CreateOrderRequest
): Partial<Record<keyof CreateOrderRequest, string>> {
  const errors: Partial<Record<keyof CreateOrderRequest, string>> = {}

  if (!values.email.trim()) {
    errors.email = "Email is required"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address"
  }
  if (!values.shippingName.trim()) {
    errors.shippingName = "Full name is required"
  }
  if (!values.shippingPhone.trim()) {
    errors.shippingPhone = "Phone is required"
  } else if (!/^\d{10}$/.test(values.shippingPhone.trim())) {
    errors.shippingPhone = "Phone must be 10 digits"
  }
  if (!values.shippingAddress.trim()) {
    errors.shippingAddress = "Address is required"
  }
  if (!values.shippingCity.trim()) {
    errors.shippingCity = "City is required"
  }
  if (!values.shippingPincode.trim()) {
    errors.shippingPincode = "Pincode is required"
  } else if (!/^\d{6}$/.test(values.shippingPincode.trim())) {
    errors.shippingPincode = "Pincode must be 6 digits"
  }

  return errors
}

function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, loading, refreshCart } = useCart()
  const [step, setStep] = useState<CheckoutStep>("address")
  const [address, setAddress] = useState<CreateOrderRequest>(emptyAddress)
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateOrderRequest, string>>
  >({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && cart && cart.items.length === 0) {
      navigate({ to: "/cart" })
    }
  }, [loading, cart, navigate])

  function handleChange(field: keyof CreateOrderRequest, value: string) {
    setAddress((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleContinueToReview() {
    const validationErrors = validateAddress(address)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setStep("review")
  }

  async function handlePlaceOrder() {
    const validationErrors = validateAddress(address)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setStep("address")
      return
    }

    setSubmitting(true)

    try {
      const order = await placeOrder({
        email: address.email.trim(),
        shippingName: address.shippingName.trim(),
        shippingPhone: address.shippingPhone.trim(),
        shippingAddress: address.shippingAddress.trim(),
        shippingCity: address.shippingCity.trim(),
        shippingPincode: address.shippingPincode.trim(),
      })
      await refreshCart()
      toast.success("Order placed successfully")
      navigate({
        to: "/orders/$orderId",
        params: { orderId: String(order.id) },
      })
    } catch (err) {
      const message =
        axios.isAxiosError<ApiError>(err) && err.response?.data?.error
          ? err.response.data.error
          : "Failed to place order, please try again"
      toast.error(message)
      setSubmitting(false)
    }
  }

  if (loading && !cart) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return null
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-xl font-semibold text-foreground">Checkout</h1>

      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <span
          className={
            step === "address"
              ? "font-semibold text-foreground"
              : undefined
          }
        >
          1. Address
        </span>
        <span>→</span>
        <span
          className={
            step === "review" ? "font-semibold text-foreground" : undefined
          }
        >
          2. Review
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          {step === "address" ? (
            <AddressForm
              values={address}
              onChange={handleChange}
              errors={errors}
            />
          ) : (
            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-foreground">
                    Delivery Address
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep("address")}
                  >
                    Edit
                  </Button>
                </div>
                <div className="space-y-1 text-sm text-foreground">
                  <p>{address.email}</p>
                  <p className="font-medium">{address.shippingName}</p>
                  <p>{address.shippingPhone}</p>
                  <p>{address.shippingAddress}</p>
                  <p>
                    {address.shippingCity} - {address.shippingPincode}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h2 className="mb-4 text-base font-semibold text-foreground">
                  Order Items
                </h2>
                <ul className="space-y-3">
                  {cart.items.map((item) => {
                    const imageUrl = item.product.images[0]?.url
                    const variantParts = [item.size, item.color].filter(Boolean)
                    return (
                      <li
                        key={item.id}
                        className="flex gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                      >
                        <div className="flex size-16 shrink-0 items-center justify-center rounded bg-muted p-1">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.product.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              No image
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {item.product.name}
                          </p>
                          {variantParts.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {variantParts.join(" · ")}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-4 text-base font-semibold text-foreground">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Price ({cart.totalItems} items)</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-semibold text-foreground">
                  <span>Total Amount</span>
                  <span>{formatPrice(cart.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {step === "address" ? (
            <Button
              className="w-full bg-accent text-accent-foreground hover:bg-accent/80"
              onClick={handleContinueToReview}
            >
              Continue to Review
            </Button>
          ) : (
            <Button
              className="w-full bg-accent text-accent-foreground hover:bg-accent/80"
              disabled={submitting}
              onClick={handlePlaceOrder}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
