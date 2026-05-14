import { useQuery } from "@tanstack/react-query"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "@tanstack/react-router"
import api from "@/lib/axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Eye, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { useEffect, useMemo, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { usePagination, DOTS } from "@/hooks/use-pagination"

interface Form {
    id: string
    status: "in-progress" | "completed"
    currentStage: number
    updatedAt: string
}

export function DashboardPage() {
    const navigate = useNavigate()
    const { isAuthenticated, logout } = useAuthStore()
    const [page, setPage] = useState(1)
    const limit = 5

    useEffect(() => {
        if (!isAuthenticated) {
            navigate({ to: "/login" })
        }
    }, [isAuthenticated, navigate])

    const { data, isLoading } = useQuery({
        queryKey: ["forms", page],
        queryFn: async () => {
            const response = await api.get("/v1/forms", {
                params: { limit, page }
            })
            return response.data.data
        },
        enabled: isAuthenticated,
    })

    const { data: pendingForms } = useQuery<Form[]>({
        queryKey: ["pending-forms"],
        queryFn: async () => {
            const response = await api.get("/v1/forms/pending")
            return response.data
        },
        enabled: isAuthenticated,
    })

    const columns = useMemo<ColumnDef<Form>[]>(() => [
        {
            accessorKey: "id",
            header: "Form ID",
            cell: ({ row }) => <span className="font-mono text-[10px] text-muted-foreground">{row.original.id}</span>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.status === "completed" ? "default" : "secondary"} className="capitalize">
                    {row.original.status}
                </Badge>
            ),
        },
        {
            accessorKey: "currentStage",
            header: "Progress",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Progress value={(row.original.currentStage / 5) * 100} className="w-12 h-1.5" />
                    <span className="text-xs font-medium text-muted-foreground">Stage {row.original.currentStage}</span>
                </div>
            ),
        },
        {
            accessorKey: "updatedAt",
            header: "Last Updated",
            cell: ({ row }) => (
                <span className="text-xs text-muted-foreground">
                    {new Date(row.original.updatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <Button variant="ghost" size="sm" asChild className="h-8">
                    <Link to="/forms/$id" params={{ id: row.original.id }}>
                        {row.original.status === "completed" ? (
                            <><Eye className="h-3.5 w-3.5 mr-2" /> View</>
                        ) : (
                            <><RefreshCw className="h-3.5 w-3.5 mr-2" /> Resume</>
                        )}
                    </Link>
                </Button>
            ),
        },
    ], [])

    const records = useMemo(() => {
        return (Array.isArray(data) ? data : (data?.items || data?.records || data?.data)) || []
    }, [data])

    const meta = data?.meta || { total: 0, totalPages: 1, page: 1, hasNextPage: false, hasPreviousPage: false }

    const paginationRange = usePagination({
        currentPage: page,
        totalCount: meta.total,
        pageSize: limit,
        siblingCount: 1
    })

    const table = useReactTable({
        data: records,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (!isAuthenticated) return null

    return (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between border-b pb-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Recruitment Dashboard
                    </h1>
                    <p className="text-muted-foreground font-medium">Overview of your application journeys and history.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => logout()} variant="ghost" className="hover:bg-destructive/10 hover:text-destructive">Logout</Button>
                    <Button asChild className="shadow-lg shadow-primary/20">
                        <Link to="/forms/new">
                            <Plus className="h-4 w-4 mr-2" />
                            New Application
                        </Link>
                    </Button>
                </div>
            </div>

            {pendingForms && pendingForms.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-primary">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        Active Applications ({pendingForms.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pendingForms.map((form) => (
                            <Card key={form.id} className="group border-primary/20 bg-primary/[0.02] hover:bg-primary/[0.05] transition-all hover:shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xs font-mono text-muted-foreground">{form.id.slice(0, 8)}...</CardTitle>
                                        <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">Stage {form.currentStage}</Badge>
                                    </div>
                                    <CardDescription className="text-[10px]">Updated {new Date(form.updatedAt).toLocaleDateString()}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button className="w-full h-9" variant="secondary" size="sm" asChild>
                                        <Link to="/forms/$id" params={{ id: form.id }}>Resume Application</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Application History</CardTitle>
                            <CardDescription>Comprehensive list of all your recruitment activities.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="rounded-xl border bg-background/50 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} className="h-12 font-bold text-primary">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground italic">
                                            Retrieving your applications...
                                        </TableCell>
                                    </TableRow>
                                ) : table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} className="group">
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="py-3">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <p className="font-medium">No applications found</p>
                                                <Button variant="link" size="sm" asChild>
                                                    <Link to="/forms/new">Start your first one now</Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
                        <div className="text-sm text-muted-foreground font-medium">
                            Showing <span className="text-foreground">{records.length}</span> of <span className="text-foreground">{meta.total}</span> records
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPage(p => p - 1)}
                                disabled={!meta.hasPreviousPage || isLoading}
                                className="h-9 w-9"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            
                            <div className="flex items-center gap-1">
                                {paginationRange?.map((pageNumber, idx) => {
                                    if (pageNumber === DOTS) {
                                        return <span key={idx} className="px-2 text-muted-foreground text-sm font-bold">...</span>
                                    }

                                    return (
                                        <Button
                                            key={idx}
                                            variant={pageNumber === page ? "default" : "ghost"}
                                            size="sm"
                                            onClick={() => setPage(Number(pageNumber))}
                                            className={`h-9 w-9 ${pageNumber === page ? "shadow-md shadow-primary/20" : ""}`}
                                        >
                                            {pageNumber}
                                        </Button>
                                    )
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPage(p => p + 1)}
                                disabled={!meta.hasNextPage || isLoading}
                                className="h-9 w-9"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
