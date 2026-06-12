export interface ProductImage {
  id: number
  url: string
  productId: number
}

export interface Category {
  id: number
  name: string
}

export interface ProductColor {
  name: string
  token: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  mrp: number
  stock: number
  rating: number
  brand: string | null
  sizes: string[]
  colors: ProductColor[]
  categoryId: number
  createdAt: string
  images: ProductImage[]
  category: Category
}

export interface ApiError {
  error: string
}

export interface HomeSearchParams {
  search?: string
  category?: string
}

export interface CartProduct {
  id: number
  name: string
  description: string
  price: number
  mrp: number
  stock: number
  rating: number
  brand: string | null
  categoryId: number
  createdAt: string
  images: ProductImage[]
}

export interface CartItemDTO {
  id: number
  quantity: number
  size: string
  color: string
  userId: number
  productId: number
  product: CartProduct
}

export interface CartResponse {
  items: CartItemDTO[]
  subtotal: number
  totalAmount: number
  totalItems: number
}

export interface RemoveCartItemResponse {
  success: boolean
}

export interface WishlistSuccessResponse {
  success: boolean
}

export interface AddToCartOptions {
  size?: string
  color?: string
}

export interface CreateOrderRequest {
  email: string
  shippingName: string
  shippingPhone: string
  shippingAddress: string
  shippingCity: string
  shippingPincode: string
}

export type OrderProductDetail = CartProduct

export interface OrderItemDetail {
  id: number
  orderId: number
  productId: number
  quantity: number
  priceAtOrder: number
  product: OrderProductDetail
}

export interface Order {
  id: number
  userId: number
  totalAmount: number
  email: string | null
  status: string
  createdAt: string
  shippingName: string
  shippingPhone: string
  shippingAddress: string
  shippingCity: string
  shippingPincode: string
  items: OrderItemDetail[]
}

export type CreateOrderResponse = Order

export interface OrderListProduct {
  id: number
  name: string
  images: ProductImage[]
}

export interface OrderListItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  priceAtOrder: number
  product: OrderListProduct
}

export interface OrderListEntry {
  id: number
  userId: number
  totalAmount: number
  email: string | null
  status: string
  createdAt: string
  shippingName: string
  shippingPhone: string
  shippingAddress: string
  shippingCity: string
  shippingPincode: string
  items: OrderListItem[]
}
