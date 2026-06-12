import axios from "axios"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { toast } from "sonner"

import { useWishlist } from "@/context/WishlistContext"
import {
  addToCart as addToCartApi,
  getCart,
  removeFromCart as removeFromCartApi,
  updateCartItem,
} from "@/lib/api"
import type { AddToCartOptions, ApiError, CartResponse } from "@/lib/types"

interface CartContextValue {
  cart: CartResponse | null
  cartCount: number
  loading: boolean
  error: string | null
  refreshCart: () => Promise<void>
  addToCart: (
    productId: number,
    quantity: number,
    options?: AddToCartOptions
  ) => Promise<void>
  updateQuantity: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError<ApiError>(err) && err.response?.data?.error) {
    return err.response.data.error
  }
  return "Something went wrong. Please try again."
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isInWishlist, removeFromWishlist } = useWishlist()
  const [cart, setCart] = useState<CartResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshCart = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCart()
      setCart(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addToCart = useCallback(
    async (
      productId: number,
      quantity: number,
      options?: AddToCartOptions
    ) => {
      setLoading(true)
      setError(null)
      try {
        await addToCartApi(productId, quantity, options)
        if (isInWishlist(productId)) {
          await removeFromWishlist(productId, { silent: true })
        }
        await refreshCart()
        toast.success("Added to cart")
      } catch (err) {
        const message = getErrorMessage(err)
        setError(message)
        toast.error(message)
        setLoading(false)
      }
    },
    [refreshCart, isInWishlist, removeFromWishlist]
  )

  const removeItem = useCallback(
    async (itemId: number) => {
      setLoading(true)
      setError(null)
      try {
        await removeFromCartApi(itemId)
        await refreshCart()
        toast.success("Removed from cart")
      } catch (err) {
        const message = getErrorMessage(err)
        setError(message)
        toast.error(message)
        setLoading(false)
      }
    },
    [refreshCart]
  )

  const updateQuantity = useCallback(
    async (itemId: number, quantity: number) => {
      if (quantity === 0) {
        await removeItem(itemId)
        return
      }

      setLoading(true)
      setError(null)
      try {
        await updateCartItem(itemId, quantity)
        await refreshCart()
      } catch (err) {
        const message = getErrorMessage(err)
        setError(message)
        toast.error(message)
        setLoading(false)
      }
    },
    [refreshCart, removeItem]
  )

  const cartCount = cart?.totalItems ?? 0

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      loading,
      error,
      refreshCart,
      addToCart,
      updateQuantity,
      removeItem,
    }),
    [
      cart,
      cartCount,
      loading,
      error,
      refreshCart,
      addToCart,
      updateQuantity,
      removeItem,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
