import { clsx, type ClassValue } from "clsx"
import type { LucideIcon } from "lucide-react"
import {
  Armchair,
  BookOpen,
  Dumbbell,
  FlaskRound,
  Home,
  Laptop,
  Microwave,
  Shirt,
  Smartphone,
  Sparkles,
  Tag,
  ToyBrick,
  UtensilsCrossed,
} from "lucide-react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateDiscount(
  price: number,
  mrp: number
): number | null {
  if (mrp <= price) return null
  return Math.round((1 - price / mrp) * 100)
}

export function parseCategoryParam(
  category: string | undefined
): string[] {
  if (!category) return []
  return category
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean)
}

export function serializeCategoryParam(categories: string[]): string | undefined {
  if (categories.length === 0) return undefined
  return categories.join(",")
}

export function parseLimitParam(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined

  const parsed = typeof value === "number" ? value : Number(String(value))
  if (Number.isNaN(parsed)) return undefined

  return Math.min(Math.max(Math.trunc(parsed), 1), 50)
}

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  fashion: Shirt,
  electronics: Laptop,
  mobiles: Smartphone,
  beauty: Sparkles,
  home: Home,
  "home & kitchen": UtensilsCrossed,
  appliances: Microwave,
  books: BookOpen,
  furniture: Armchair,
  toys: ToyBrick,
  sports: Dumbbell,
  fragrances: FlaskRound,
}

export function getCategoryIcon(categoryName: string): LucideIcon {
  const key = categoryName.trim().toLowerCase()
  return CATEGORY_ICON_MAP[key] ?? Tag
}

