
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetContactInquiriesQuery } from "@/services/api";
import { InquiriesTable } from "@/components/admin/inquiries/inquiries-table";
import { Mail, Clock, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function InquiriesPage() {
    const { data: inquiries = [], isLoading } = useGetContactInquiriesQuery(undefined);

    const totalInquiries = inquiries.length;
    const unreadCount = inquiries.filter((i: any) => !i.isRead).length;
    const readCount = totalInquiries - unreadCount;
    
    const renderCardContent = (value: number) => {
        return isLoading ? <Skeleton className="h-8 w-1/3" /> : <div className="text-2xl font-bold">{value}</div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Contact Form Inquiries</h1>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(totalInquiries)}
                        <p className="text-xs text-muted-foreground">All time submissions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unread</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(unreadCount)}
                        <p className="text-xs text-muted-foreground">Awaiting response</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Archived</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(readCount)}
                        <p className="text-xs text-muted-foreground">Read and archived</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Inquiry Inbox</CardTitle>
                    <CardDescription>View and manage messages from the contact form.</CardDescription>
                </CardHeader>
                <CardContent>
                    <InquiriesTable inquiries={inquiries} isLoading={isLoading} />
                </CardContent>
            </Card>
        </div>
    );
}
