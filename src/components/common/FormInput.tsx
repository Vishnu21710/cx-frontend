import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    required?: boolean
    error?: any
    touched?: boolean
}

export function FormInput({ label, required, error, touched, className, ...props }: FormInputProps) {
    const errorMessage = (touched && error) 
        ? (typeof error === 'string' ? error : (error as any).message || (typeof error === 'object' ? JSON.stringify(error) : String(error))) 
        : null

    return (
        <div className={cn("grid gap-2 items-start", className)}>
            <Label htmlFor={props.id} className="flex items-center gap-1">
                {label}
                {required && <span className="text-destructive">*</span>}
            </Label>
            <Input
                {...props}
                className={cn(errorMessage && "border-destructive focus-visible:ring-destructive/20")}
            />
            {errorMessage && errorMessage !== "{}" && (
                <p className="text-[0.8rem] font-medium text-destructive leading-none">
                    {errorMessage}
                </p>
            )}
        </div>
    )
}
