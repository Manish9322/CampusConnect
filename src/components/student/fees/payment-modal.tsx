
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FeeRecord } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Banknote, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  feeRecord: FeeRecord;
  onPaymentSuccess: () => void;
}

export function PaymentModal({ isOpen, onOpenChange, feeRecord, onPaymentSuccess }: PaymentModalProps) {
    const [selectedMethod, setSelectedMethod] = React.useState("credit-card");
    const [isProcessing, setIsProcessing] = React.useState(false);
    const { toast } = useToast();

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            onPaymentSuccess();
            onOpenChange(false);
        }, 2000);
    }
    
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Make a Payment</DialogTitle>
          <DialogDescription>
            You are about to pay the outstanding amount of <strong>${feeRecord.dueAmount.toLocaleString()}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
            <p>Select a payment method:</p>
            <RadioGroup defaultValue="credit-card" onValueChange={setSelectedMethod}>
                <div className="flex items-center space-x-2 p-4 border rounded-md has-[:checked]:bg-accent/20 has-[:checked]:border-accent">
                    <RadioGroupItem value="credit-card" id="r1" />
                    <Label htmlFor="r1" className="flex items-center gap-3 w-full">
                        <CreditCard className="h-5 w-5" />
                        Credit/Debit Card
                    </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-md has-[:checked]:bg-accent/20 has-[:checked]:border-accent">
                    <RadioGroupItem value="upi" id="r2" />
                    <Label htmlFor="r2" className="flex items-center gap-3 w-full">
                        <Smartphone className="h-5 w-5" />
                        UPI
                    </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-md has-[:checked]:bg-accent/20 has-[:checked]:border-accent">
                    <RadioGroupItem value="net-banking" id="r3" />
                    <Label htmlFor="r3" className="flex items-center gap-3 w-full">
                        <Banknote className="h-5 w-5" />
                        Net Banking
                    </Label>
                </div>
            </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? "Processing..." : `Pay $${feeRecord.dueAmount.toLocaleString()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
