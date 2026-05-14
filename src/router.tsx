import { createRouter, createRoute, useNavigate } from '@tanstack/react-router'
import { Route as rootRoute } from './routes/__root'
import { indexRoute } from './routes/index'
import { LoginPage } from './pages/auth/login'
import { RegisterPage } from './pages/auth/register'
import { MultiStageForm } from './pages/forms/multi-stage-form'
import { useEffect } from 'react'
import api from './lib/axios'

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
  component: () => {
    const navigate = useNavigate()
    useEffect(() => {
        const createForm = async () => {
            const response = await api.post("/v1/forms")
            const { id } = response.data.data
            navigate({ to: `/forms/${id}` })
        }
        createForm()
    }, [])
    return <div>Creating form...</div>
  },
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
