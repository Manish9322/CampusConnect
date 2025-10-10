
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PaymentHistory } from "@/lib/types";
import { Download } from "lucide-react";
import { Building2 } from "lucide-react";
import { mockFeeRecords } from "@/lib/mock-data";

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentHistory;
  studentName: string;
}

export function PaymentReceiptModal({ isOpen, onOpenChange, payment, studentName }: PaymentReceiptModalProps) {
    const feeRecord = mockFeeRecords.find(record => record.studentName === studentName)!;

    const handlePrint = () => {
        const printContent = document.getElementById("receipt-content");
        const windowUrl = 'about:blank';
        const uniqueName = new Date().getTime();
        const windowName = 'Print' + uniqueName;
        const printWindow = window.open(windowUrl, windowName, 'left=50000,top=50000,width=0,height=0');

        if (printWindow && printContent) {
            printWindow.document.write('<html><head><title>Print Receipt</title>');
            printWindow.document.write('<style>body{font-family:sans-serif;padding:2rem;} table{width:100%;border-collapse:collapse;} th,td{padding:8px;text-align:left;border-bottom:1px solid #ddd;}</style>');
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <div id="receipt-content-wrapper" className="bg-white text-black p-4 sm:p-6 overflow-y-auto">
            <div id="receipt-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building2 className="h-8 w-8" style={{ color: '#000' }}/>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>CampusConnect</h1>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#555' }}>
                        <p style={{ margin: 0 }}>123 University Ave</p>
                        <p style={{ margin: 0 }}>Learnington, ED 54321</p>
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Payment Receipt</h2>
                    <table style={{ width: '100%', fontSize: '0.9rem' }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '0.5rem', fontWeight: '600' }}>Student Name:</td>
                                <td style={{ padding: '0.5rem' }}>{studentName}</td>
                                <td style={{ padding: '0.5rem', fontWeight: '600' }}>Receipt Date:</td>
                                <td style={{ padding: '0.5rem' }}>{new Date().toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '0.5rem', fontWeight: '600' }}>Payment Date:</td>
                                <td style={{ padding: '0.5rem' }}>{new Date(payment.date).toLocaleDateString()}</td>
                                <td style={{ padding: '0.5rem', fontWeight: '600' }}>Payment Method:</td>
                                <td style={{ padding: '0.5rem' }}>{payment.method}</td>
                            </tr>
                             <tr>
                                <td style={{ padding: '0.5rem', fontWeight: '600' }}>Transaction ID:</td>
                                <td colSpan={3} style={{ padding: '0.5rem', fontFamily: 'monospace' }}>{payment.transactionId}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Fee Details</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead style={{ backgroundColor: '#f9fafb' }}>
                            <tr>
                                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #eee' }}>Description</th>
                                <th style={{ padding: '0.75rem', textAlign: 'right', border: '1px solid #eee' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feeRecord.components.map((comp) => (
                            <tr key={comp.name}>
                                <td style={{ padding: '0.75rem', border: '1px solid #eee' }}>{comp.name}</td>
                                <td style={{ padding: '0.75rem', textAlign: 'right', border: '1px solid #eee' }}>${comp.amount.toLocaleString()}</td>
                            </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr style={{ fontWeight: 'bold' }}>
                                <td style={{ padding: '0.75rem', textAlign: 'right', border: '1px solid #eee' }}>Total Paid</td>
                                <td style={{ padding: '0.75rem', textAlign: 'right', border: '1px solid #eee' }}>${payment.amount.toLocaleString()}</td>
                            </tr>
                            <tr style={{ fontWeight: 'bold', backgroundColor: '#f9fafb' }}>
                                <td style={{ padding: '0.75rem', textAlign: 'right', border: '1px solid #eee' }}>Total Fee</td>
                                <td style={{ padding: '0.75rem', textAlign: 'right', border: '1px solid #eee' }}>${feeRecord.totalAmount.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1.5rem', borderTop: '2px solid #eee' }}>
                    <div style={{ fontSize: '0.8rem', color: '#555' }}>
                        <p style={{ margin: 0 }}>Thank you for your payment!</p>
                        <p style={{ margin: 0 }}>This is a computer-generated receipt and does not require a signature.</p>
                    </div>
                     <div style={{ border: '3px solid #22c55e', color: '#22c55e', padding: '0.5rem 1rem', borderRadius: '0.25rem', transform: 'rotate(-10deg)', fontWeight: 'bold', fontSize: '1.5rem' }}>
                        PAID
                    </div>
                </div>
            </div>
        </div>
        <DialogFooter className="mt-auto pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={handlePrint}>
            <Download className="mr-2 h-4 w-4" /> Print / Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
