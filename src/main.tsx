import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import "./index.css"
import { router } from "./router"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { Toaster } from "@/components/ui/sonner"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster richColors/>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
