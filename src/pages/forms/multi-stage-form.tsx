import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "@tanstack/react-router"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import { useState, useEffect } from "react"
import { Stage1Form } from "./stages/stage-1"
import { Stage2Form } from "./stages/stage-2"
import { Stage3Form } from "./stages/stage-3"
import { Stage4Form } from "./stages/stage-4"
import { Stage5Form } from "./stages/stage-5"
import { CheckCircle2, Circle } from "lucide-react"
import { ViewSubmission } from "./view-submission"

export function MultiStageForm() {
    const { id } = useParams({ from: '/forms/$id' })
    const [currentStage, setCurrentStage] = useState(1)
    const [hasInitialized, setHasInitialized] = useState(false)

    const { data: form, isLoading, refetch } = useQuery({
        queryKey: ["form", id],
        queryFn: async () => {
            const response = await api.get(`/v1/forms/${id}`)
            return response.data.data
        },
    })

    useEffect(() => {
        if (form && !hasInitialized) {
            setCurrentStage(form.currentStage || 1)
            setHasInitialized(true)
        }
    }, [form, hasInitialized])

    const handleStageSuccess = async () => {
        await refetch()
        if (currentStage < totalStages) {
            setCurrentStage(prev => prev + 1)
        }
    }

    if (isLoading) return <div className="p-10 text-center text-muted-foreground">Loading form...</div>
    if (!form) return <div className="p-10 text-center text-destructive">Form not found.</div>

    const totalStages = 5
    const progress = (currentStage / totalStages) * 100

    const stages = [
        { id: 1, title: "Basic Information" },
        { id: 2, title: "Address Details" },
        { id: 3, title: "Professional Details" },
        { id: 4, title: "Document Upload" },
        { id: 5, title: "Emergency Contact" },
    ]

    if (form.status === "completed") {
        return (
            <div className="container max-w-4xl mx-auto p-6">
                <ViewSubmission form={form} />
            </div>
        )
    }

    return (
        <div className="container max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Application Form</h1>
                    <p className="text-muted-foreground">Please complete all stages to submit your application.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link to="/">Back to Dashboard</Link>
                </Button>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm mb-2">
                    <span className="font-medium">Stage {currentStage} of {totalStages}</span>
                    <span className="text-muted-foreground font-medium">{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />

                <div className="grid grid-cols-5 gap-2 pt-2">
                    {stages.map((stage) => (
                        <button
                            key={stage.id}
                            className={`flex flex-col items-center gap-1 transition-all ${(stage.id <= (form.currentStage || 1)) ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed"
                                }`}
                            disabled={stage.id > (form.currentStage || 1)}
                            onClick={() => setCurrentStage(stage.id)}
                        >
                            {currentStage > stage.id ? (
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                            ) : currentStage === stage.id ? (
                                <Circle className="h-5 w-5 text-primary fill-primary/20" />
                            ) : (
                                <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                            <span className={`text-[10px] text-center font-medium ${currentStage === stage.id ? 'text-primary' : 'text-muted-foreground'}`}>
                                {stage.title}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => setCurrentStage(prev => prev - 1)}
                    disabled={currentStage === 1}
                >
                    Previous Step
                </Button>
                <div className="text-sm text-muted-foreground italic">
                    All progress is automatically saved as you move between stages.
                </div>
            </div>

            <Card className="shadow-lg border-muted-foreground/10">
                <CardHeader>
                    <CardTitle>{stages[currentStage - 1].title}</CardTitle>
                    <CardDescription>Enter the required information for stage {currentStage}.</CardDescription>
                </CardHeader>
                <CardContent>
                    {currentStage === 1 && <Stage1Form formId={id} initialData={form} onSuccess={handleStageSuccess} />}
                    {currentStage === 2 && <Stage2Form formId={id} initialData={form} onSuccess={handleStageSuccess} />}
                    {currentStage === 3 && <Stage3Form formId={id} initialData={form} onSuccess={handleStageSuccess} />}
                    {currentStage === 4 && <Stage4Form formId={id} initialData={form} onSuccess={handleStageSuccess} />}
                    {currentStage === 5 && <Stage5Form formId={id} initialData={form} onSuccess={handleStageSuccess} />}
                </CardContent>
            </Card>

        </div>
    )
}
