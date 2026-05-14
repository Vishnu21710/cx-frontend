import axios from "axios"
import { useAuthStore } from "@/store/auth-store"
import { toast } from "sonner"

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"
// ... rest of the setup

const api = axios.create({
    baseURL,
    withCredentials: true, // Required for cookies
    headers: {
        "Content-Type": "application/json",
    },
})

// Request Interceptor: Attach Access Token to Header
api.interceptors.request.use(
    (config) => {
        const { accessToken } = useAuthStore.getState()
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response Interceptor: Handle 401s and Refresh Token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        const { refreshToken, setAccessToken, logout } = useAuthStore.getState()

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                // Call refresh endpoint
                // Note: If using cookies, the browser will send the refresh cookie automatically
                // But the requirement says support both, so we'll check if we have a refresh token in store too
                const response = await axios.post(`${baseURL}/v1/auth/refresh`, {}, {
                    withCredentials: true,
                    headers: refreshToken ? { Authorization: `Bearer ${refreshToken}` } : {}
                })

                const { accessToken: newAccessToken } = response.data.data
                setAccessToken(newAccessToken)

                // Update the original request header and retry
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
            } catch (refreshError) {
                // If refresh fails, log out
                logout()
                return Promise.reject(refreshError)
            }
        }

        // Global Error Handling
        const message = error.response?.data?.message
        if (message) {
            const description = Array.isArray(message) ? message.join(". ") : message
            toast.error("Error", { description })
        } else if (error.message) {
            toast.error(error.message)
        }

        return Promise.reject(error)
    }
)

export default api
