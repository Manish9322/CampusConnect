
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetFaqsQuery } from "@/services/api";
import { FaqTable } from "@/components/admin/faq/faq-table";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, FileText, HelpCircle, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ManageFaqPage() {
    const { data: faqs = [], isLoading } = useGetFaqsQuery(undefined);
    const [limit, setLimit] = React.useState('5');
    const { toast } = useToast();

    React.useEffect(() => {
        const savedLimit = localStorage.getItem('faq_limit');
        if (savedLimit) {
            setLimit(savedLimit);
        }
    }, []);

    const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(e.target.value);
    };

    const handleSaveLimit = () => {
        localStorage.setItem('faq_limit', limit);
        toast({
            title: "Limit Saved",
            description: `The FAQ display limit has been set to ${limit}.`,
        });
    };

    const totalFaqs = faqs.length;
    const approvedCount = faqs.filter((f: any) => f.approved).length;
    const pendingCount = totalFaqs - approvedCount;

    const renderCardContent = (value: number) => {
        return isLoading ? <Skeleton className="h-8 w-1/3" /> : <div className="text-2xl font-bold">{value}</div>
    }

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold">Manage FAQs</h1>
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total FAQs</CardTitle>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(totalFaqs)}
                        <p className="text-xs text-muted-foreground">All questions submitted</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(approvedCount)}
                        <p className="text-xs text-muted-foreground">Visible on the homepage</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(pendingCount)}
                        <p className="text-xs text-muted-foreground">Awaiting approval</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Display Settings</CardTitle>
                    <CardDescription>Control how many FAQs are shown on the homepage.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-end gap-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="limit">Number of FAQs to Show</Label>
                        <Input id="limit" type="number" value={limit} onChange={handleLimitChange} min="1" />
                    </div>
                    <Button onClick={handleSaveLimit}>Save Limit</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="space-y-1.5">
                    <CardTitle className="text-xl md:text-2xl">Frequently Asked Questions</CardTitle>
                    <CardDescription className="text-sm">
                        Create, edit, and approve FAQs to be displayed on the homepage.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-2 md:px-6">
                    <FaqTable faqs={faqs} isLoading={isLoading} />
                </CardContent>
            </Card>
        </div>
    );
}
