import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageModalProps {
    isOpen: boolean
    onClose: () => void
    imageUrl: string
    title: string
}

export function ImageModal({ isOpen, onClose, imageUrl, title }: ImageModalProps) {
    if (!isOpen) return null

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div 
                className="relative max-w-4xl w-full max-h-[90vh] bg-background rounded-xl shadow-2xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <div className="flex-1 overflow-auto p-2 bg-muted/20 flex items-center justify-center">
                    <img 
                        src={imageUrl} 
                        alt={title} 
                        className="max-w-full max-h-full object-contain shadow-md rounded-sm"
                    />
                </div>
                <div className="p-4 border-t bg-muted/5 flex justify-end">
                    <Button onClick={onClose}>Close View</Button>
                </div>
            </div>
        </div>
    )
}
