import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import { FormInput } from "@/components/common/FormInput"
import { FormSelect } from "@/components/common/FormSelect"

const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
    { label: "Prefer not to say", value: "prefer_not_to_say" },
]

export function Stage1Form({ formId, initialData, onSuccess }: any) {
    const form = useForm({
        defaultValues: {
            firstName: initialData?.firstName || "",
            lastName: initialData?.lastName || "",
            email: initialData?.email || "",
            phone: initialData?.phone || "",
            dateOfBirth: initialData?.dateOfBirth || "",
            gender: initialData?.gender || "",
        },
        validators: {
            onChange: z.object({
                firstName: z.string().min(2, "First name must be at least 2 characters"),
                lastName: z.string().min(1, "Last name is required"),
                email: z.string().email("Invalid email address"),
                phone: z.string().regex(/^[6-9]\d{9}$/, "Must be a valid 10-digit Indian phone number starting with 6-9"),
                dateOfBirth: z.string().min(1, "Date of birth is required"),
                gender: z.string().min(1, "Gender is required"),
            }),
        },
        onSubmit: async ({ value }) => {
            const formData = new FormData()
            Object.entries(value).forEach(([key, val]) => {
                formData.append(key, val as string)
            })

            try {
                await api.post(`/v1/forms/${formId}/stage/1`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
                onSuccess()
            } catch (error) {
                console.error("Stage 1 failed", error)
            }
        },
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
            className="space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <form.Field
                    name="firstName"
                    children={(field) => (
                        <FormInput
                            label="First Name"
                            required
                            value={field.state.value}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^a-zA-Z\s]/g, "")
                                field.handleChange(val)
                            }}
                            onBlur={field.handleBlur}
                            error={field.state.meta.errors[0]}
                            touched={field.state.meta.isTouched}
                            placeholder="Enter first name"
                        />
                    )}
                />
                <form.Field
                    name="lastName"
                    children={(field) => (
                        <FormInput
                            label="Last Name"
                            required
                            value={field.state.value}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^a-zA-Z\s]/g, "")
                                field.handleChange(val)
                            }}
                            onBlur={field.handleBlur}
                            error={field.state.meta.errors[0]}
                            touched={field.state.meta.isTouched}
                            placeholder="Enter last name"
                        />
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <form.Field
                    name="email"
                    children={(field) => (
                        <FormInput
                            label="Email"
                            type="email"
                            required
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            error={field.state.meta.errors[0]}
                            touched={field.state.meta.isTouched}
                            placeholder="john.doe@example.com"
                        />
                    )}
                />
                <form.Field
                    name="phone"
                    children={(field) => (
                        <FormInput
                            label="Phone"
                            required
                            value={field.state.value}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "").slice(0, 10)
                                field.handleChange(val)
                            }}
                            onBlur={field.handleBlur}
                            error={field.state.meta.errors[0]}
                            touched={field.state.meta.isTouched}
                            placeholder="9876543210"
                        />
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <form.Field
                    name="dateOfBirth"
                    children={(field) => (
                        <FormInput
                            label="Date of Birth"
                            type="date"
                            required
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            error={field.state.meta.errors[0]}
                            touched={field.state.meta.isTouched}
                        />
                    )}
                />
                <form.Field
                    name="gender"
                    children={(field) => (
                        <FormSelect
                            label="Gender"
                            required
                            placeholder="Select gender"
                            options={genderOptions}
                            value={field.state.value}
                            onValueChange={(val) => field.handleChange(val)}
                            error={field.state.meta.errors[0]}
                            touched={field.state.meta.isTouched}
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
