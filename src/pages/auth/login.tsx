import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "@tanstack/react-router"
import api from "@/lib/axios"
import { useAuthStore } from "@/store/auth-store"
import { FormInput } from "@/components/common/FormInput"
import { Loader } from "lucide-react"

export function LoginPage() {
    const navigate = useNavigate()
    const setAuth = useAuthStore((state) => state.setAuth)

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        validators: {
            onChange: z.object({
                email: z.string().email("Invalid email address"),
                password: z.string().min(6, "Password must be at least 6 characters"),
            }),
        },
        onSubmit: async ({ value }) => {
            try {
                const response = await api.post("/v1/auth/login", value)
                const { user, accessToken, refreshToken } = response.data.data
                setAuth(user, accessToken, refreshToken)
                navigate({ to: "/" })
            } catch (error: any) {
                console.error("Login failed", error)
            }
        },
    })

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-6">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
                    <CardDescription>
                        Enter your credentials to access your dashboard
                    </CardDescription>
                </CardHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                >
                    <CardContent className="grid gap-6">
                        <form.Field
                            name="email"
                            children={(field) => (
                                <FormInput
                                    label="Email"
                                    type="email"
                                    required
                                    placeholder="m@example.com"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    error={field.state.meta.errors[0]}
                                    touched={field.state.meta.isTouched}
                                />
                            )}
                        />
                        <form.Field
                            name="password"
                            children={(field) => (
                                <FormInput
                                    label="Password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    error={field.state.meta.errors[0]}
                                    touched={field.state.meta.isTouched}
                                />
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 mt-2">
                        <form.Subscribe
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                            children={([canSubmit, isSubmitting]) => (
                                <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={!canSubmit || isSubmitting}>
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <Loader className="h-4 w-4 animate-spin" />
                                            Logging in...
                                        </span>
                                    ) : "Login"}
                                </Button>
                            )}
                        />
                        <div className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link to="/register" className="font-medium text-primary underline underline-offset-4 hover:opacity-80">
                                Create an account
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
