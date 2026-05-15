import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import { FormInput } from "@/components/common/FormInput"
import { Loader } from "lucide-react"

export function Stage3Form({ formId, initialData, onSuccess }: any) {
    const form = useForm({
        defaultValues: {
            company: initialData?.company || "",
            designation: initialData?.designation || "",
            yearsOfExperience: initialData?.yearsOfExperience || "",
            skills: initialData?.skills || "",
            linkedInUrl: initialData?.linkedInUrl || "",
            portfolioUrl: initialData?.portfolioUrl || "",
        },
        validators: {
            onChange: z.object({
                company: z.string().min(1, "Company is required"),
                designation: z.string().min(1, "Designation is required"),
                yearsOfExperience: z.string().min(1, "Years of experience is required"),
                skills: z.string().min(1, "Skills are required"),
                linkedInUrl: z.string().url("Invalid LinkedIn URL").or(z.string().length(0)),
                portfolioUrl: z.string().url("Invalid Portfolio URL").or(z.string().length(0)),
            }),
        },
        onSubmit: async ({ value }) => {
            const formData = new FormData()
            Object.entries(value).forEach(([key, val]) => {
                formData.append(key, val as string)
            })

            try {
                await api.post(`/v1/forms/${formId}/stage/3`, formData)
                onSuccess()
            } catch (error) {
                console.error("Stage 3 failed", error)
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <form.Field
                    name="company"
                    children={(field) => (
                        <FormInput
                            label="Company"
                            required
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            error={field.state.meta.errors[0]}
                            touched={field.state.meta.isTouched}
                            placeholder="Current/Last Company"
                        />
                    )}
                />
                <form.Field
                    name="designation"
                    children={(field) => (
                        <FormInput
                            label="Designation"
                            required
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            error={field.state.meta.errors[0]}
                            touched={field.state.meta.isTouched}
                            placeholder="Software Engineer, etc."
                        />
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <form.Field
                    name="yearsOfExperience"
                    children={(field) => (
                        <FormInput
                            label="Years of Experience"
                            type="number"
                            required
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            error={field.state.meta.errors[0]}
                            touched={field.state.meta.isTouched}
                            placeholder="5"
                        />
                    )}
                />
                <form.Field
                    name="skills"
                    children={(field) => (
                        <FormInput
                            label="Skills"
                            required
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            error={field.state.meta.errors[0]}
                            touched={field.state.meta.isTouched}
                            placeholder="React, Node.js, etc."
                        />
                    )}
                />
            </div>

            <form.Field
                name="linkedInUrl"
                children={(field) => (
                    <FormInput
                        label="LinkedIn URL"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        error={field.state.meta.errors[0]}
                        touched={field.state.meta.isTouched}
                        placeholder="https://linkedin.com/in/username"
                    />
                )}
            />
            <form.Field
                name="portfolioUrl"
                children={(field) => (
                    <FormInput
                        label="Portfolio URL"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        error={field.state.meta.errors[0]}
                        touched={field.state.meta.isTouched}
                        placeholder="https://yourportfolio.com"
                    />
                )}
            />

            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                    <Button type="submit" className="w-full h-11" disabled={!canSubmit || isSubmitting}>
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <Loader className="h-4 w-4 animate-spin" />
                                Saving...
                            </span>
                        ) : "Save & Next"}
                    </Button>
                )}
            />
        </form>
    )
}
