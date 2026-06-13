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

import {
  addToWishlist as addToWishlistApi,
  getProductById,
  getWishlist,
  removeFromWishlist as removeFromWishlistApi,
} from "@/lib/api"
import type { ApiError, Product } from "@/lib/types"

interface RemoveFromWishlistOptions {
  silent?: boolean
}

interface WishlistContextValue {
  wishlist: Product[]
  wishlistCount: number
  loading: boolean
  error: string | null
  refreshWishlist: (options?: { showLoading?: boolean }) => Promise<void>
  isInWishlist: (productId: number) => boolean
  removeFromWishlist: (
    productId: number,
    options?: RemoveFromWishlistOptions
  ) => Promise<void>
  toggleWishlist: (productId: number) => Promise<void>
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError<ApiError>(err) && err.response?.data?.error) {
    return err.response.data.error
  }
  return "Something went wrong. Please try again."
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshWishlist = useCallback(async (options?: { showLoading?: boolean }) => {
    if (options?.showLoading) {
      setLoading(true)
    }
    setError(null)
    try {
      const data = await getWishlist()
      setWishlist(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      if (options?.showLoading) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    refreshWishlist({ showLoading: true })
  }, [refreshWishlist])

  const isInWishlist = useCallback(
    (productId: number) => wishlist.some((p) => p.id === productId),
    [wishlist]
  )

  const removeFromWishlist = useCallback(
    async (productId: number, options?: RemoveFromWishlistOptions) => {
      if (!wishlist.some((p) => p.id === productId)) {
        return
      }

      setError(null)
      const previous = wishlist
      setWishlist((items) => items.filter((p) => p.id !== productId))

      try {
        await removeFromWishlistApi(productId)
        if (!options?.silent) {
          toast.success("Removed from wishlist")
        }
      } catch (err) {
        setWishlist(previous)
        const message = getErrorMessage(err)
        setError(message)
        if (!options?.silent) {
          toast.error(message)
        }
      }
    },
    [wishlist]
  )

  const toggleWishlist = useCallback(
    async (productId: number) => {
      const inWishlist = wishlist.some((p) => p.id === productId)
      setError(null)

      if (inWishlist) {
        await removeFromWishlist(productId)
        return
      }

      try {
        await addToWishlistApi(productId)
        toast.success("Added to wishlist")

        const product = await getProductById(productId)
        setWishlist((items) => {
          if (items.some((p) => p.id === productId)) return items
          return [product, ...items]
        })
      } catch (err) {
        const message = getErrorMessage(err)
        setError(message)
        toast.error(message)
        await refreshWishlist()
      }
    },
    [wishlist, refreshWishlist, removeFromWishlist]
  )

  const wishlistCount = wishlist.length

  const value = useMemo(
    () => ({
      wishlist,
      wishlistCount,
      loading,
      error,
      refreshWishlist,
      isInWishlist,
      removeFromWishlist,
      toggleWishlist,
    }),
    [
      wishlist,
      wishlistCount,
      loading,
      error,
      refreshWishlist,
      isInWishlist,
      removeFromWishlist,
      toggleWishlist,
    ]
  )

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  )
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
