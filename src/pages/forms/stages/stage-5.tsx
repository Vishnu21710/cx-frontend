import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import { useNavigate } from "@tanstack/react-router"
import { CheckCircle } from "lucide-react"
import { FormInput } from "@/components/common/FormInput"
import { FormSelect } from "@/components/common/FormSelect"

const relationshipOptions = [
    { label: "Spouse", value: "spouse" },
    { label: "Parent", value: "parent" },
    { label: "Sibling", value: "sibling" },
    { label: "Friend", value: "friend" },
    { label: "Colleague", value: "colleague" },
    { label: "Other", value: "other" },
]

export function Stage5Form({ formId, initialData, onSuccess }: any) {
    const navigate = useNavigate()
    const form = useForm({
        defaultValues: {
            emergencyContactName: initialData?.emergencyContactName || "",
            emergencyContactPhone: initialData?.emergencyContactPhone || "",
            emergencyContactRelationship: initialData?.emergencyContactRelationship || "",
        },
        validators: {
            onChange: z.object({
                emergencyContactName: z.string().min(1, "Name is required"),
                emergencyContactPhone: z.string().min(10, "Phone must be at least 10 digits"),
                emergencyContactRelationship: z.string().min(1, "Relationship is required"),
            }),
        },
        onSubmit: async ({ value }) => {
            const formData = new FormData()
            Object.entries(value).forEach(([key, val]) => {
                formData.append(key, val as string)
            })

            try {
                // Save stage 5
                await api.post(`/v1/forms/${formId}/stage/5`, formData)

                // Final submission
                await api.post(`/v1/forms/${formId}/submit`)

                onSuccess()
                navigate({ to: "/" })
            } catch (error) {
                console.error("Stage 5 / Submission failed", error)
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
                name="emergencyContactName"
                children={(field) => (
                    <FormInput
                        label="Emergency Contact Name"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        error={field.state.meta.errors[0]}
                        touched={field.state.meta.isTouched}
                        placeholder="Full Name"
                    />
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <form.Field
                    name="emergencyContactPhone"
                    children={(field) => (
                        <FormInput
                            label="Emergency Contact Phone"
                            required
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            error={field.state.meta.errors[0]}
                            touched={field.state.meta.isTouched}
                            placeholder="+91 9876543210"
                        />
                    )}
                />
                <form.Field
                    name="emergencyContactRelationship"
                    children={(field) => (
                        <FormSelect
                            label="Relationship"
                            required
                            placeholder="Select relationship"
                            options={relationshipOptions}
                            value={field.state.value}
                            onValueChange={(val) => field.handleChange(val)}
                            error={field.state.meta.errors[0]?.toString()}
                        />
                    )}
                />
            </div>

            <div className="p-4 bg-muted/30 rounded-lg border border-dashed text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Ready to submit?</p>
                <p className="text-xs text-muted-foreground font-medium italic">Make sure all information provided is accurate. You cannot edit after submission.</p>
            </div>

            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                    <Button type="submit" className="w-full h-12 text-lg" disabled={!canSubmit}>
                        {isSubmitting ? "Submitting..." : (
                            <span className="flex items-center gap-2 font-semibold">
                                Complete & Submit Application <CheckCircle className="h-5 w-5" />
                            </span>
                        )}
                    </Button>
                )}
            />
        </form>
    )
}
