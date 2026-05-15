import { createRouter, createRoute, useNavigate } from '@tanstack/react-router'
import { Route as rootRoute } from './routes/__root'
import { indexRoute } from './routes/index'
import { LoginPage } from './pages/auth/login'
import { RegisterPage } from './pages/auth/register'
import { MultiStageForm } from './pages/forms/multi-stage-form'
import { useEffect } from 'react'
import api from './lib/axios'
import { Loader } from 'lucide-react'

let createFormRequest: Promise<string> | null = null

function createFormOnce() {
  if (!createFormRequest) {
    createFormRequest = api.post("/v1/forms")
      .then((response) => response.data.data.id)
      .finally(() => {
        createFormRequest = null
      })
  }

  return createFormRequest
}

function NewFormPage() {
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    createFormOnce().then((id) => {
      if (isMounted) {
        navigate({ to: `/forms/${id}` })
      }
    })

    return () => {
      isMounted = false
    }
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center gap-2 text-muted-foreground">
      <Loader className="h-5 w-5 animate-spin" />
      <span>Creating form...</span>
    </div>
  )
}

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
})

const newFormRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forms/new',
  component: NewFormPage,
})

const formDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forms/$id',
  component: MultiStageForm,
})

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, registerRoute, newFormRoute, formDetailRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
