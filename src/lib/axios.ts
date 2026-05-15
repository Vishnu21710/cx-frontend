import axios from "axios"
import { useAuthStore } from "@/store/auth-store"
import { toast } from "sonner"

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"


const api = axios.create({
    baseURL,
    withCredentials: true, 
    headers: {
        "Content-Type": "application/json",
    },
})

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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        const { refreshToken, setAccessToken, logout } = useAuthStore.getState()

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const response = await axios.post(`${baseURL}/v1/auth/refresh`, {}, {
                    withCredentials: true,
                    headers: refreshToken ? { Authorization: `Bearer ${refreshToken}` } : {}
                })

                const { accessToken: newAccessToken } = response.data.data
                setAccessToken(newAccessToken)

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
            } catch (refreshError) {
                logout()
                return Promise.reject(refreshError)
            }
        }

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
