
"use client";

import { TestimonialsTable } from "@/components/admin/testimonials/testimonials-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTestimonialsQuery } from "@/services/api";
import { Star, Check, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManageTestimonialsPage() {
    const { data: testimonials = [], isLoading } = useGetTestimonialsQuery({});

    const totalTestimonials = testimonials.length;
    const approvedCount = testimonials.filter((t: any) => t.approved).length;
    const pendingCount = totalTestimonials - approvedCount;

    const renderCardContent = (value: number) => {
        return isLoading ? <Skeleton className="h-8 w-1/3" /> : <div className="text-2xl font-bold">{value}</div>
    }

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold">Manage Testimonials</h1>
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(totalTestimonials)}
                        <p className="text-xs text-muted-foreground">All feedback received</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <Check className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(approvedCount)}
                        <p className="text-xs text-muted-foreground">Visible on the public site</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(pendingCount)}
                        <p className="text-xs text-muted-foreground">Awaiting approval</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader className="space-y-1.5">
                    <CardTitle className="text-xl md:text-2xl">Testimonial Submissions</CardTitle>
                    <CardDescription className="text-sm">
                        Review, approve, and manage user-submitted testimonials.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-2 md:px-6">
                    <TestimonialsTable testimonials={testimonials} isLoading={isLoading} />
                </CardContent>
            </Card>
        </div>
    );
}
