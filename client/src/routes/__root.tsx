import { createRootRoute, Outlet } from "@tanstack/react-router"

import { Navbar } from "@/components/Navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { CartProvider } from "@/context/CartContext"
import { WishlistProvider } from "@/context/WishlistContext"

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <ThemeProvider>
      <WishlistProvider>
        <CartProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-88px)] bg-background">
            <Outlet />
          </main>
          <Toaster position="top-right" richColors />
        </CartProvider>
      </WishlistProvider>
    </ThemeProvider>
  )
}
