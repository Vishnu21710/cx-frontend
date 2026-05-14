import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FormSelectProps {
    label: string
    placeholder?: string
    options: { label: string; value: string }[]
    value?: string
    onValueChange?: (value: string) => void
    required?: boolean
    error?: any
    touched?: boolean
    className?: string
    id?: string
}

export function FormSelect({
    label,
    placeholder,
    options,
    value,
    onValueChange,
    required,
    error,
    touched,
    className,
    id
}: FormSelectProps) {
    const errorMessage = (touched && error) 
        ? (typeof error === 'string' ? error : (error as any).message || (typeof error === 'object' ? JSON.stringify(error) : String(error))) 
        : null

    return (
        <div className={cn("grid gap-2 items-start", className)}>
            <Label htmlFor={id} className="flex items-center gap-1">
                {label}
                {required && <span className="text-destructive">*</span>}
            </Label>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger
                    id={id}
                    className={cn(errorMessage && "border-destructive focus-visible:ring-destructive/20")}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errorMessage && errorMessage !== "{}" && (
                <p className="text-[0.8rem] font-medium text-destructive leading-none">
                    {errorMessage}
                </p>
            )}
        </div>
    )
}
