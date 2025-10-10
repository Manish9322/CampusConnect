
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { mockFeeRecords } from "@/lib/mock-data";
import { FeeStatus, FeeRecord, PaymentHistory } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock, AlertCircle, Receipt, Download } from "lucide-react";
import { PaymentModal } from "./payment-modal";
import { useToast } from "@/hooks/use-toast";
import { PaymentReceiptModal } from "./payment-receipt-modal";

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

export function FeePaymentDetails() {
    // Assuming logged in student is Alice Johnson
    const initialFeeRecord = mockFeeRecords.find(record => record.studentId === 'S001')!;
    const [feeRecord, setFeeRecord] = React.useState<FeeRecord>(initialFeeRecord);
    const [isPaymentModalOpen, setPaymentModalOpen] = React.useState(false);
    const [isReceiptModalOpen, setReceiptModalOpen] = React.useState(false);
    const [selectedPayment, setSelectedPayment] = React.useState<PaymentHistory | null>(null);
    const { toast } = useToast();

    const handlePaymentSuccess = () => {
        const updatedRecord: FeeRecord = {
            ...feeRecord,
            dueAmount: 0,
            status: 'Paid',
            paymentHistory: [
                ...feeRecord.paymentHistory,
                {
                    id: `P${Date.now()}`,
                    date: new Date().toISOString().split('T')[0],
                    amount: feeRecord.dueAmount,
                    method: 'Credit Card', // Mock method
                    transactionId: `TXN${Date.now()}`
                }
            ]
        };
        setFeeRecord(updatedRecord);
        toast({
            title: "Payment Successful!",
            description: "Your fee payment has been processed successfully.",
        });
    };

    const handleViewReceipt = (payment: PaymentHistory) => {
        setSelectedPayment(payment);
        setReceiptModalOpen(true);
    };

    const StatusIcon = statusConfig[feeRecord.status].icon;

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>My Fee Details</CardTitle>
                        <CardDescription>An overview of your current fee status and payment history.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 border rounded-lg">
                                    <div className="text-sm text-muted-foreground">Total Fee</div>
                                    <div className="text-2xl font-bold">${feeRecord.totalAmount.toLocaleString()}</div>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <div className="text-sm text-muted-foreground">Amount Paid</div>
                                    <div className="text-2xl font-bold text-green-600">${(feeRecord.totalAmount - feeRecord.dueAmount).toLocaleString()}</div>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <div className="text-sm text-muted-foreground">Due Amount</div>
                                    <div className="text-2xl font-bold text-red-600">${feeRecord.dueAmount.toLocaleString()}</div>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <div className="text-sm text-muted-foreground">Due Date</div>
                                    <div className="text-lg font-semibold">{new Date(feeRecord.dueDate).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div>
                                <CardTitle className="text-lg mb-4">Payment History</CardTitle>
                                <div className="rounded-md border">
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
                                            {feeRecord.paymentHistory.map(p => (
                                                <TableRow key={p.id}>
                                                    <TableCell>{p.date}</TableCell>
                                                    <TableCell>${p.amount.toLocaleString()}</TableCell>
                                                    <TableCell>{p.method}</TableCell>
                                                    <TableCell>{p.transactionId}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon" onClick={() => handleViewReceipt(p)}>
                                                            <Receipt className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <StatusIcon className={cn("h-8 w-8", statusConfig[feeRecord.status].className)} />
                            <div>
                                <CardTitle>Current Status</CardTitle>
                                <Badge variant={statusVariant[feeRecord.status]} className={cn('mt-1', feeRecord.status === 'Paid' && 'bg-green-600 text-white')}>
                                    {feeRecord.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {feeRecord.status === 'Paid' 
                                    ? "All your fees are cleared. Thank you!" 
                                    : `Your next payment of $${feeRecord.dueAmount} is due on ${new Date(feeRecord.dueDate).toLocaleDateString()}.`}
                            </p>
                        </CardContent>
                        {feeRecord.status !== 'Paid' && (
                            <CardFooter>
                                <Button className="w-full" onClick={() => setPaymentModalOpen(true)}>Pay Now</Button>
                            </CardFooter>
                        )}
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Fee Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {feeRecord.components.map((comp, index) => (
                                <React.Fragment key={comp.name}>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">{comp.name}</span>
                                        <span className="font-medium">${comp.amount.toLocaleString()}</span>
                                    </div>
                                    {index < feeRecord.components.length - 1 && <Separator />}
                                </React.Fragment>
                            ))}
                            <Separator className="my-3"/>
                             <div className="flex justify-between items-center text-md font-bold">
                                <span>Total</span>
                                <span>${feeRecord.totalAmount.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <PaymentModal 
                isOpen={isPaymentModalOpen}
                onOpenChange={setPaymentModalOpen}
                feeRecord={feeRecord}
                onPaymentSuccess={handlePaymentSuccess}
            />

            {selectedPayment && (
                <PaymentReceiptModal
                    isOpen={isReceiptModalOpen}
                    onOpenChange={setReceiptModalOpen}
                    payment={selectedPayment}
                    studentName={feeRecord.studentName}
                />
            )}
        </>
    );
}
