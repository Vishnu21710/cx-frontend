import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import { CheckCircle2, FileIcon, Mail, MapPin, Briefcase, Users } from "lucide-react"

export function ViewSubmission({ form }: { form: any }) {
    const Section = ({ title, icon: Icon, children }: any) => (
        <Card className="border-muted-foreground/10">
            <CardHeader className="pb-3 bg-muted/30">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
            </CardContent>
        </Card>
    )

    const Field = ({ label, value }: { label: string, value: any }) => (
        <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-sm font-semibold">{value || "N/A"}</p>
        </div>
    )

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-green-500 rounded-full p-2">
                        <CheckCircle2 className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-green-700">Application Submitted</h2>
                        <p className="text-green-600/80">Submitted on {new Date(form.submittedAt).toLocaleDateString()} at {new Date(form.submittedAt).toLocaleTimeString()}</p>
                    </div>
                </div>
                <Button asChild variant="outline" className="border-green-500/30 hover:bg-green-500/10">
                    <Link to="/">Back to Dashboard</Link>
                </Button>
            </div>

            <Section title="Basic Information" icon={Mail}>
                <Field label="Full Name" value={`${form.firstName} ${form.lastName}`} />
                <Field label="Email Address" value={form.email} />
                <Field label="Phone Number" value={form.phone} />
                <Field label="Date of Birth" value={form.dateOfBirth} />
                <Field label="Gender" value={form.gender} />
            </Section>

            <Section title="Address Details" icon={MapPin}>
                <Field label="Address Line 1" value={form.addressLine1} />
                <Field label="Address Line 2" value={form.addressLine2} />
                <Field label="City" value={form.city} />
                <Field label="State" value={form.state} />
                <Field label="Pincode" value={form.pincode} />
                <Field label="Country" value={form.country} />
            </Section>

            <Section title="Professional Details" icon={Briefcase}>
                <Field label="Company" value={form.company} />
                <Field label="Designation" value={form.designation} />
                <Field label="Experience" value={`${form.yearsOfExperience} Years`} />
                <Field label="LinkedIn" value={form.linkedInUrl} />
                <Field label="Portfolio" value={form.portfolioUrl} />
                <div className="md:col-span-2">
                    <Field label="Skills" value={form.skills} />
                </div>
            </Section>

            <Section title="Documents" icon={FileIcon}>
                <div className="space-y-4 md:col-span-2">
                    {[
                        { label: "Photo ID", url: form.photoIdPath },
                        { label: "Resume", url: form.resumePath },
                        ...(form.additionalDocuments || []).map((url: string, i: number) => ({
                            label: `Additional Document ${i + 1}`,
                            url
                        }))
                    ].map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <div className="flex items-center gap-3">
                                <FileIcon className="h-5 w-5 text-primary" />
                                <span className="text-sm font-medium">{doc.label}</span>
                            </div>
                            <Button size="sm" variant="secondary" asChild>
                                <a href={doc.url} target="_blank" rel="noopener noreferrer">View Document</a>
                            </Button>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Emergency Contact" icon={Users}>
                <Field label="Contact Name" value={form.emergencyContactName} />
                <Field label="Relationship" value={form.emergencyContactRelationship} />
                <Field label="Phone Number" value={form.emergencyContactPhone} />
            </Section>
        </div>
    )
}
