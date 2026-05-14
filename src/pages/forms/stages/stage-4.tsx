import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import { useDropzone } from "react-dropzone"
import { useState } from "react"
import { Upload, X, FileIcon, Eye } from "lucide-react"
import { ImageModal } from "@/components/common/ImageModal"

export function Stage4Form({ formId, initialData, onSuccess }: any) {
    const [files, setFiles] = useState<{ [key: string]: File | null }>({
        photoId: null,
        resume: null,
        additionalDocument1: null,
        additionalDocument2: null,
        additionalDocument3: null,
    })

    const [viewingImage, setViewingImage] = useState<{ url: string, title: string } | null>(null)

    const hasExistingPhoto = !!initialData?.photoIdPath
    const hasExistingResume = !!initialData?.resumePath
    const existingAdditional = initialData?.additionalDocuments || []

    const onDrop = (acceptedFiles: File[], fieldName: string) => {
        setFiles(prev => ({ ...prev, [fieldName]: acceptedFiles[0] }))
    }

    const removeFile = (fieldName: string) => {
        setFiles(prev => ({ ...prev, [fieldName]: null }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData()
        
        if (files.photoId) formData.append("photoId", files.photoId)
        if (files.resume) formData.append("resume", files.resume)
        if (files.additionalDocument1) formData.append("additionalDocuments", files.additionalDocument1)
        if (files.additionalDocument2) formData.append("additionalDocuments", files.additionalDocument2)
        if (files.additionalDocument3) formData.append("additionalDocuments", files.additionalDocument3)

        try {
            await api.post(`/v1/forms/${formId}/stage/4`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            onSuccess()
        } catch (error) {
            console.error("Stage 4 failed", error)
        }
    }

    const FileUpload = ({ name, label, required, existingUrl }: { name: string, label: string, required?: boolean, existingUrl?: string }) => {
        const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop: (accepted) => onDrop(accepted, name),
            multiple: false,
        })

        const file = files[name]
        const isImage = (f: File | null) => f && f.type.startsWith("image/")
        const isUrlImage = (url: string | undefined) => url && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url)

        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-1">
                        {label} {required && <span className="text-destructive">*</span>}
                    </label>
                    {existingUrl && !file && (
                        <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200 font-medium">
                            Already Uploaded
                        </span>
                    )}
                </div>
                
                {file ? (
                    <div className="flex items-center gap-4 p-3 border rounded-md bg-primary/5 border-primary/20">
                        {isImage(file) ? (
                            <div className="relative group cursor-pointer" onClick={() => setViewingImage({ url: URL.createObjectURL(file), title: label })}>
                                <img 
                                    src={URL.createObjectURL(file)} 
                                    alt="Preview" 
                                    className="h-12 w-12 rounded object-cover border border-primary/20 shadow-sm"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                                    <Eye className="h-4 w-4 text-white" />
                                </div>
                            </div>
                        ) : (
                            <div className="h-12 w-12 rounded bg-muted flex items-center justify-center border">
                                <FileIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <div className="flex items-center gap-1">
                            {isImage(file) && (
                                <Button variant="ghost" size="sm" type="button" onClick={() => setViewingImage({ url: URL.createObjectURL(file), title: label })}>
                                    View
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => removeFile(name)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : existingUrl ? (
                    <div className="flex items-center gap-4 p-3 border rounded-md bg-muted/30 border-dashed">
                        {isUrlImage(existingUrl) ? (
                            <div className="relative group cursor-pointer" onClick={() => setViewingImage({ url: existingUrl, title: label })}>
                                <img 
                                    src={existingUrl} 
                                    alt="Existing" 
                                    className="h-12 w-12 rounded object-cover border border-muted-foreground/20"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                                    <Eye className="h-4 w-4 text-white" />
                                </div>
                            </div>
                        ) : (
                            <div className="h-12 w-12 rounded bg-muted flex items-center justify-center border">
                                <FileIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-muted-foreground italic truncate">File saved in S3</p>
                            <p className="text-xs text-muted-foreground truncate">{existingUrl.split('/').pop()}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            {isUrlImage(existingUrl) && (
                                <Button variant="ghost" size="sm" type="button" onClick={() => setViewingImage({ url: existingUrl, title: label })}>
                                    View
                                </Button>
                            )}
                            <div {...getRootProps()} className="cursor-pointer">
                                <input {...getInputProps()} />
                                <Button variant="outline" size="sm" type="button">Replace</Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-all duration-200 ${
                            isDragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50"
                        }`}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                                <Upload className="h-5 w-5 text-primary" />
                            </div>
                            <p className="text-sm font-medium">
                                {isDragActive ? "Drop the file here" : `Click to upload ${label}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                or drag and drop here (PDF, JPG, PNG)
                            </p>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <FileUpload name="photoId" label="Photo ID" required existingUrl={initialData?.photoIdPath} />
                <FileUpload name="resume" label="Resume" required existingUrl={initialData?.resumePath} />
                
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold">Additional Documents (Max 3)</h3>
                    <FileUpload name="additionalDocument1" label="Additional Document 1" existingUrl={existingAdditional[0]} />
                    <FileUpload name="additionalDocument2" label="Additional Document 2" existingUrl={existingAdditional[1]} />
                    <FileUpload name="additionalDocument3" label="Additional Document 3" existingUrl={existingAdditional[2]} />
                </div>

                <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={(!files.photoId && !hasExistingPhoto) || (!files.resume && !hasExistingResume)}
                >
                    Save & Next
                </Button>
            </form>

            <ImageModal 
                isOpen={!!viewingImage} 
                onClose={() => setViewingImage(null)} 
                imageUrl={viewingImage?.url || ""} 
                title={viewingImage?.title || ""} 
            />
        </div>
    )
}
