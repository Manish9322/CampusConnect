
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PaymentHistory } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Download } from "lucide-react";
import { Building2 } from "lucide-react";

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentHistory;
  studentName: string;
}

export function PaymentReceiptModal({ isOpen, onOpenChange, payment, studentName }: PaymentReceiptModalProps) {
    const handlePrint = () => {
        const printContent = document.getElementById("receipt-content");
        const windowUrl = 'about:blank';
        const uniqueName = new Date().getTime();
        const windowName = 'Print' + uniqueName;
        const printWindow = window.open(windowUrl, windowName, 'left=50000,top=50000,width=0,height=0');

        if (printWindow && printContent) {
            printWindow.document.write('<html><head><title>Print Receipt</title>');
            printWindow.document.write('<style>body{font-family:sans-serif;padding:20px;}</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(printContent.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }
    };
    
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <div id="receipt-content">
            <DialogHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Building2 className="h-8 w-8" />
                    <h1 className="text-2xl font-bold">CampusConnect</h1>
                </div>
                <DialogTitle className="text-xl">Payment Receipt</DialogTitle>
                <DialogDescription>
                    A copy of your recent transaction.
                </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Student Name:</span>
                    <span className="font-medium">{studentName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Date:</span>
                    <span className="font-medium">{new Date(payment.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="font-medium">{payment.method}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <span className="font-mono text-xs">{payment.transactionId}</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-lg">
                    <span className="font-bold">Amount Paid:</span>
                    <span className="font-bold">${payment.amount.toLocaleString()}</span>
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={handlePrint}>
            <Download className="mr-2 h-4 w-4" /> Print / Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
