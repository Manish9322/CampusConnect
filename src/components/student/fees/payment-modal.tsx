
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRazorpay } from "@/hooks/use-razorpay";
import { Loader2 } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  amountToPay: number;
  onPaymentSuccess: () => void;
  studentName: string;
}

export function PaymentModal({ isOpen, onOpenChange, amountToPay, onPaymentSuccess, studentName }: PaymentModalProps) {
    const [isProcessing, setIsProcessing] = React.useState(false);
    const { toast } = useToast();
    const { displayRazorpay } = useRazorpay();

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            const orderResponse = await fetch('/api/razorpay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amountToPay * 100,
                    currency: 'INR',
                }),
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create Razorpay order');
            }

            const order = await orderResponse.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: order.amount,
                currency: order.currency,
                name: 'CampusConnect',
                description: `Fee Payment for ${studentName}`,
                order_id: order.id,
                handler: async (response: any) => {
                    try {
                        const verificationResponse = await fetch('/api/razorpay', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });
                        
                        if (!verificationResponse.ok) {
                            throw new Error('Payment verification failed');
                        }

                        onPaymentSuccess();
                    } catch (error) {
                        toast({
                            title: "Payment Verification Failed",
                            description: "Please contact support.",
                            variant: "destructive",
                        });
                    }
                },
                prefill: {
                    name: studentName,
                    email: studentName.toLowerCase().replace(' ', '.') + '@example.com',
                    contact: '9999999999',
                    method: {
                        upi: true,
                        card: true,
                        netbanking: true,
                        wallet: true
                    }
                },
                notes: {
                    studentId: "STUDENT_ID_PLACEHOLDER", // Replace with actual student ID
                },
                theme: { color: '#3399cc' },
            };
            
            await displayRazorpay(options);

        } catch (error) {
            toast({
                title: "Payment Error",
                description: "Could not initiate payment. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
            onOpenChange(false);
        }
    };
    
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Make a Payment</DialogTitle>
          <DialogDescription>
            You are about to pay <strong>₹{amountToPay.toLocaleString()}</strong>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={isProcessing || amountToPay <= 0}>
            {isProcessing ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                </>
             ) : (
                `Pay ₹${amountToPay.toLocaleString()}`
             )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
