import axios from "axios"

import type {
  AddToCartOptions,
  CartItemDTO,
  CartResponse,
  Category,
  CreateOrderRequest,
  Order,
  OrderListEntry,
  Product,
  RemoveCartItemResponse,
  WishlistSuccessResponse,
} from "@/lib/types"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000",
})

export async function getProducts(params: {
  search?: string
  category?: string | string[]
  limit?: number
}): Promise<Product[]> {
  const query: Record<string, string> = {}
  if (params.search) query.search = params.search
  if (params.category) {
    query.category = Array.isArray(params.category)
      ? params.category.join(",")
      : params.category
  }
  if (params.limit) query.limit = String(params.limit)

  const { data } = await api.get<Product[]>("/api/products", { params: query })
  return data
}

export async function getProductById(id: number): Promise<Product> {
  const { data } = await api.get<Product>(`/api/products/${id}`)
  return data
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/api/categories")
  return data
}

export async function getCart(): Promise<CartResponse> {
  const { data } = await api.get<CartResponse>("/api/cart")
  return data
}

export async function addToCart(
  productId: number,
  quantity: number,
  options?: AddToCartOptions
): Promise<CartItemDTO> {
  const { data } = await api.post<CartItemDTO>("/api/cart", {
    productId,
    quantity,
    size: options?.size ?? "",
    color: options?.color ?? "",
  })
  return data
}

export async function updateCartItem(
  itemId: number,
  quantity: number
): Promise<CartItemDTO> {
  const { data } = await api.put<CartItemDTO>(`/api/cart/${itemId}`, {
    quantity,
  })
  return data
}

export async function removeFromCart(
  itemId: number
): Promise<RemoveCartItemResponse> {
  const { data } = await api.delete<RemoveCartItemResponse>(
    `/api/cart/${itemId}`
  )
  return data
}

export async function getWishlist(): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/api/wishlist")
  return data
}

export async function addToWishlist(
  productId: number
): Promise<WishlistSuccessResponse> {
  const { data } = await api.post<WishlistSuccessResponse>("/api/wishlist", {
    productId,
  })
  return data
}

export async function removeFromWishlist(
  productId: number
): Promise<WishlistSuccessResponse> {
  const { data } = await api.delete<WishlistSuccessResponse>(
    `/api/wishlist/${productId}`
  )
  return data
}

export async function placeOrder(data: CreateOrderRequest): Promise<Order> {
  const { data: order } = await api.post<Order>("/api/orders", data)
  return order
}

export async function getOrders(): Promise<OrderListEntry[]> {
  const { data } = await api.get<OrderListEntry[]>("/api/orders")
  return data
}

export async function getOrderById(id: number): Promise<Order> {
  const { data } = await api.get<Order>(`/api/orders/${id}`)
  return data
}
