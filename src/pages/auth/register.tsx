import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "@tanstack/react-router"
import api from "@/lib/axios"
import { useAuthStore } from "@/store/auth-store"
import { FormInput } from "@/components/common/FormInput"

export function RegisterPage() {
    const navigate = useNavigate()
    const setAuth = useAuthStore((state) => state.setAuth)

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
        validators: {
            onChange: z.object({
                name: z.string().min(2, "Name must be at least 2 characters"),
                email: z.string().email("Invalid email address"),
                password: z.string().min(8, "Password must be at least 8 characters"),
            }),
        },
        onSubmit: async ({ value }) => {
            try {
                const response = await api.post("/v1/auth/register", value)
                const { user, accessToken, refreshToken } = response.data.data
                setAuth(user, accessToken, refreshToken)
                navigate({ to: "/" })
            } catch (error: any) {
                console.error("Registration failed", error)
            }
        },
    })

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-6">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold">Create an account</CardTitle>
                    <CardDescription>
                        Enter your information to create your account
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
                            name="name"
                            children={(field) => (
                                <FormInput
                                    label="Full Name"
                                    required
                                    placeholder="John Doe"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    error={field.state.meta.errors[0]}
                                    touched={field.state.meta.isTouched}
                                />
                            )}
                        />
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
                                <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={!canSubmit}>
                                    {isSubmitting ? "Creating account..." : "Register"}
                                </Button>
                            )}
                        />
                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-primary underline underline-offset-4 hover:opacity-80">
                                Login
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
