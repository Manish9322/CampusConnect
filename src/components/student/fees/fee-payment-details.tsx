
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FeeRecord, PaymentHistory, Student, FeeStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock, AlertCircle, Receipt, HelpCircle, Phone, Mail, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { PaymentModal } from "./payment-modal";
import { useToast } from "@/hooks/use-toast";
import { PaymentReceiptModal } from "./payment-receipt-modal";
import { useGetFeeSettingsQuery, useGetStudentFeeSettingsQuery, useGetFeeStructureQuery } from "@/services/api";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";


const statusConfig: { [key in FeeStatus]: { icon: React.ElementType, className: string } } = {
    Paid: { icon: CheckCircle, className: 'text-green-600' },
    Pending: { icon: Clock, className: 'text-yellow-600' },
    Overdue: { icon: AlertCircle, className: 'text-red-600' },
};

const statusVariant: { [key in FeeStatus]: "default" | "destructive" | "secondary" | "outline" } = {
    Paid: "default",
    Pending: "secondary",
    Overdue: "destructive",
};

interface FeePaymentDetailsProps {
    student: Student;
}

export function FeePaymentDetails({ student }: FeePaymentDetailsProps) {
    const { data: feeStructure = [], isLoading: isLoadingStructure } = useGetFeeStructureQuery(undefined);
    const { data: globalSettings, isLoading: isLoadingGlobal } = useGetFeeSettingsQuery({});
    const { data: studentSettings, isLoading: isLoadingStudent } = useGetStudentFeeSettingsQuery({ studentId: student._id! }, { skip: !student._id });

    const [paymentHistory, setPaymentHistory] = React.useState<PaymentHistory[]>([]);
    const [isPaymentModalOpen, setPaymentModalOpen] = React.useState(false);
    const [amountToPay, setAmountToPay] = React.useState(0);
    const [isReceiptModalOpen, setReceiptModalOpen] = React.useState(false);
    const [selectedPayment, setSelectedPayment] = React.useState<PaymentHistory | null>(null);
    const { toast } = useToast();

    // Pagination for payment history
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const isLoading = isLoadingStructure || isLoadingGlobal || isLoadingStudent;

    const totalFees = React.useMemo(() => {
        return feeStructure.filter((item: any) => item.isActive).reduce((acc: number, item: any) => acc + item.amount, 0);
    }, [feeStructure]);

    const totalPaid = React.useMemo(() => {
        return paymentHistory.reduce((acc, p) => acc + p.amount, 0);
    }, [paymentHistory]);
    
    const settings = studentSettings || globalSettings;
    const isInstallmentMode = settings?.mode === 'Installments';
    
    const totalPages = Math.ceil(paymentHistory.length / rowsPerPage);
    const paginatedHistory = paymentHistory.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(Number(value));
        setPage(0);
    };

    const handlePaymentSuccess = () => {
        const newPayment: PaymentHistory = {
            id: `P${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            amount: amountToPay,
            method: 'Credit Card',
            transactionId: `TXN${Date.now()}`
        };
        setPaymentHistory(prev => [...prev, newPayment]);
        toast({
            title: "Payment Successful!",
            description: "Your fee payment has been processed successfully.",
        });
    };

    const handlePayClick = (amount: number) => {
        setAmountToPay(amount);
        setPaymentModalOpen(true);
    };

    const handleViewReceipt = (payment: PaymentHistory) => {
        setSelectedPayment(payment);
        setReceiptModalOpen(true);
    };
    
    const getInstallmentStatus = (installment: any) => {
        const paidForInstallment = paymentHistory.filter(p => new Date(p.date) <= new Date(installment.dueDate)).reduce((acc, p) => acc + p.amount, 0);
        
        let cumulativeAmountDue = 0;
        if (!settings || !settings.installments) return "Pending";
        for (const inst of settings.installments) {
            cumulativeAmountDue += inst.amount;
            if (inst.dueDate === installment.dueDate) break;
        }

        if (totalPaid >= cumulativeAmountDue) return "Paid";
        if (new Date() > new Date(installment.dueDate)) return "Overdue";
        return "Pending";
    };
    
    const handleExport = () => {
        const headers = ["Date", "Amount", "Method", "Transaction ID"];
        const rows = paymentHistory.map(p => [
            new Date(p.date).toLocaleDateString(),
            `₹${p.amount.toLocaleString()}`,
            p.method,
            p.transactionId
        ]);
        let csvContent = headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `payment-history-${student.name}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Exported!", description: "Your payment history has been downloaded." });
    };

    if (isLoading) {
        return (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
                    <CardContent><Skeleton className="h-96 w-full" /></CardContent>
                </Card>
                 <div className="space-y-6">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }
    
    const progress = totalFees > 0 ? (totalPaid / totalFees) * 100 : 0;

    return (
        <>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Fee Payment Details</CardTitle>
                            <CardDescription>An overview of your current fee status and payment history.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                <div className="p-4 border rounded-lg">
                                    <div className="text-sm text-muted-foreground">Total Fee</div>
                                    <div className="text-2xl font-bold">₹{totalFees.toLocaleString()}</div>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <div className="text-sm text-muted-foreground">Amount Paid</div>
                                    <div className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</div>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <div className="text-sm text-muted-foreground">Balance Due</div>
                                    <div className="text-2xl font-bold text-red-600">₹{(totalFees - totalPaid).toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <p className="text-sm font-medium mb-2">Payment Progress</p>
                                <Progress value={progress} className="h-2" />
                                <p className="text-xs text-muted-foreground mt-1 text-right">{progress.toFixed(0)}% Completed</p>
                            </div>
                            
                            {isInstallmentMode ? (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Installment Schedule</h3>
                                    <div className="space-y-4">
                                        {settings.installments.map((inst: any, index: number) => {
                                            const status = getInstallmentStatus(inst);
                                            const StatusIcon = statusConfig[status].icon;
                                            return (
                                                <Card key={index}>
                                                    <CardHeader className="flex flex-row items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <StatusIcon className={cn("h-6 w-6", statusConfig[status].className)} />
                                                            <div>
                                                                <CardTitle>{inst.name}</CardTitle>
                                                                <CardDescription>Due: {new Date(inst.dueDate).toLocaleDateString()}</CardDescription>
                                                            </div>
                                                        </div>
                                                        <Badge variant={statusVariant[status]} className={cn('text-sm', status === 'Paid' && 'bg-green-600 text-white')}>{status}</Badge>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xl font-bold">₹{inst.amount.toLocaleString()}</span>
                                                            {status !== 'Paid' && <Button onClick={() => handlePayClick(inst.amount)}>Pay Now</Button>}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <h3 className="text-lg font-semibold">Full Payment Due</h3>
                                    <p className="text-4xl font-bold my-4">₹{(totalFees - totalPaid).toLocaleString()}</p>
                                    <Button size="lg" onClick={() => handlePayClick(totalFees - totalPaid)} disabled={totalFees - totalPaid <= 0}>
                                        {totalFees - totalPaid <= 0 ? 'Fully Paid' : 'Pay Full Amount'}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <div>
                                    <CardTitle>Payment History</CardTitle>
                                    <CardDescription>A record of all your past fee payments.</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleExport} disabled={paymentHistory.length === 0}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Export CSV
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <div className="hidden md:block rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Method</TableHead>
                                            <TableHead>Transaction ID</TableHead>
                                            <TableHead className="text-right">Receipt</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedHistory.length > 0 ? paginatedHistory.map(p => (
                                            <TableRow key={p.id}>
                                                <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                                                <TableCell>₹{p.amount.toLocaleString()}</TableCell>
                                                <TableCell>{p.method}</TableCell>
                                                <TableCell>{p.transactionId}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => handleViewReceipt(p)}>
                                                        <Receipt className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={5}>
                                                    <EmptyState title="No Payments Yet" description="Your payment history will appear here once you make a payment." />
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="md:hidden space-y-4">
                                {paginatedHistory.length > 0 ? paginatedHistory.map(p => (
                                    <Card key={p.id}>
                                        <CardContent className="p-4 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-semibold text-lg">₹{p.amount.toLocaleString()}</div>
                                                    <div className="text-sm text-muted-foreground">{new Date(p.date).toLocaleDateString()}</div>
                                                </div>
                                                <Badge variant="default">Paid</Badge>
                                            </div>
                                            <div className="text-xs text-muted-foreground space-y-1">
                                                <p>Method: {p.method}</p>
                                                <p>ID: {p.transactionId}</p>
                                            </div>
                                            <Button variant="outline" size="sm" className="w-full" onClick={() => handleViewReceipt(p)}>
                                                <Receipt className="mr-2 h-4 w-4" />
                                                View Receipt
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <EmptyState title="No Payments Yet" description="Your payment history will appear here." />
                                )}
                            </div>
                            
                            {paymentHistory.length > rowsPerPage && (
                                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-muted-foreground">Rows per page</span>
                                        <Select onValueChange={handleRowsPerPageChange} defaultValue={`${rowsPerPage}`}>
                                            <SelectTrigger className="w-20">
                                                <SelectValue placeholder={`${rowsPerPage}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="5">5</SelectItem>
                                                <SelectItem value="10">10</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-muted-foreground">
                                            Page {page + 1} of {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setPage(p => Math.max(0, p - 1))}
                                            disabled={page === 0}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                            disabled={page >= totalPages - 1}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Fee Structure</CardTitle>
                            <CardDescription>Breakdown of your total fees for the semester.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Component</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {feeStructure.filter((item: any) => item.isActive).map((item: any) => (
                                            <TableRow key={item._id}>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell className="text-right">₹{item.amount.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableRow className="font-bold border-t-2">
                                        <TableCell>Total</TableCell>
                                        <TableCell className="text-right">₹{totalFees.toLocaleString()}</TableCell>
                                    </TableRow>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Information</CardTitle>
                            <CardDescription>Need help with your payments?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <HelpCircle className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium">What payment methods are accepted?</p>
                                    <p className="text-sm text-muted-foreground">We accept all major credit/debit cards, UPI, and net banking.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <HelpCircle className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium">What if I miss a due date?</p>
                                    <p className="text-sm text-muted-foreground">A late fee may be applied to your account. Please contact the finance office for details.</p>
                                </div>
                            </div>
                             <Separator />
                             <div className="space-y-2">
                                 <h4 className="font-semibold text-sm">Contact Finance Office</h4>
                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    <span>+91 123 456 7890</span>
                                 </div>
                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <span>finance@campus.edu</span>
                                 </div>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <PaymentModal 
                isOpen={isPaymentModalOpen}
                onOpenChange={setPaymentModalOpen}
                amountToPay={amountToPay}
                onPaymentSuccess={handlePaymentSuccess}
                studentName={student.name}
            />

            {selectedPayment && (
                <PaymentReceiptModal
                    isOpen={isReceiptModalOpen}
                    onOpenChange={setReceiptModalOpen}
                    payment={selectedPayment}
                    studentName={student.name}
                    feeStructure={feeStructure}
                />
            )}
        </>
    );
}
