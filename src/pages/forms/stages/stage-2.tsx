import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import { FormInput } from "@/components/common/FormInput"

export function Stage2Form({ formId, initialData, onSuccess }: any) {
    const form = useForm({
        defaultValues: {
            addressLine1: initialData?.addressLine1 || "",
            addressLine2: initialData?.addressLine2 || "",
            city: initialData?.city || "",
            state: initialData?.state || "",
            pincode: initialData?.pincode || "",
            country: initialData?.country || "",
        },
        validators: {
            onChange: z.object({
                addressLine1: z.string().min(5, "Address must be at least 5 characters"),
                addressLine2: z.string(),
                city: z.string().min(1, "City is required"),
                state: z.string().min(1, "State is required"),
                pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
                country: z.string().min(1, "Country is required"),
            }),
        },
        onSubmit: async ({ value }) => {
            const formData = new FormData()
            Object.entries(value).forEach(([key, val]) => {
                formData.append(key, val as string)
            })

            try {
                await api.post(`/v1/forms/${formId}/stage/2`, formData)
                onSuccess()
            } catch (error) {
                console.error("Stage 2 failed", error)
            }
        },
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}
            className="space-y-6"
        >
            <form.Field
                name="addressLine1"
                children={(field) => (
                    <FormInput
                        label="Address Line 1"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        error={field.state.meta.errors[0]}
                        touched={field.state.meta.isTouched}
                        placeholder="House No, Street, Area"
                    />
                )}
            />
            <form.Field
                name="addressLine2"
                children={(field) => (
                    <FormInput
                        label="Address Line 2 (Optional)"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        error={field.state.meta.errors[0]}
                        touched={field.state.meta.isTouched}
                        placeholder="Landmark, Apartment"
                    />
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <form.Field
                    name="city"
                    children={(field) => (
                        <FormInput
                            label="City"
                            required
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            error={field.state.meta.errors[0]}
                            touched={field.state.meta.isTouched}
                            placeholder="City"
                        />
                    )}
                />
                <form.Field
                    name="state"
                    children={(field) => (
                        <FormInput
                            label="State"
                            required
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            error={field.state.meta.errors[0]}
                            touched={field.state.meta.isTouched}
                            placeholder="State"
                        />
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <form.Field
                    name="pincode"
                    children={(field) => (
                        <FormInput
                            label="Pincode"
                            required
                            value={field.state.value}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "").slice(0, 6)
                                field.handleChange(val)
                            }}
                            onBlur={field.handleBlur}
                            error={field.state.meta.errors[0]}
                            touched={field.state.meta.isTouched}
                            placeholder="6-digit pincode"
                        />
                    )}
                />
                <form.Field
                    name="country"
                    children={(field) => (
                        <FormInput
                            label="Country"
                            required
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            error={field.state.meta.errors[0]}
                            touched={field.state.meta.isTouched}
                            placeholder="Country"
                        />
                    )}
                />
            </div>

            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                    <Button type="submit" className="w-full h-11" disabled={!canSubmit}>
                        {isSubmitting ? "Saving..." : "Save & Next"}
                    </Button>
                )}
            />
        </form>
    )
}
