
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Student } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useGetStudentFeeSettingsQuery, useUpdateStudentFeeSettingsMutation } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface StudentFeeSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
  totalFees: number;
}

export function StudentFeeSettingsDialog({ open, onOpenChange, student, totalFees }: StudentFeeSettingsDialogProps) {
  const { data: setting, isLoading } = useGetStudentFeeSettingsQuery({ studentId: student._id! }, { skip: !student._id });
  const [updateSettings, { isLoading: isUpdating }] = useUpdateStudentFeeSettingsMutation();
  const { toast } = useToast();

  const [mode, setMode] = React.useState('Full Payment');
  const [installments, setInstallments] = React.useState([
      { name: 'Installment 1', amount: 0, dueDate: '' },
      { name: 'Installment 2', amount: 0, dueDate: '' },
      { name: 'Installment 3', amount: 0, dueDate: '' },
  ]);

  React.useEffect(() => {
    if (setting) {
      setMode(setting.mode);
      if (setting.mode === 'Installments' && setting.installments.length > 0) {
        setInstallments(setting.installments);
      }
    } else {
        // Set default due dates for new settings
        const today = new Date();
        const defaultInstallments = [
            { name: 'Installment 1', amount: 0, dueDate: new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString().split('T')[0] },
            { name: 'Installment 2', amount: 0, dueDate: new Date(today.getFullYear(), today.getMonth() + 4, 1).toISOString().split('T')[0] },
            { name: 'Installment 3', amount: 0, dueDate: new Date(today.getFullYear(), today.getMonth() + 7, 1).toISOString().split('T')[0] },
        ];
        setInstallments(defaultInstallments);
    }
  }, [setting]);

  const handleInstallmentChange = (index: number, field: 'amount' | 'dueDate', value: string) => {
    const newInstallments = [...installments];
    if (field === 'amount') {
        newInstallments[index][field] = parseFloat(value) || 0;
    } else {
        newInstallments[index][field] = value;
    }
    setInstallments(newInstallments);
  };
  
  const totalInstallmentAmount = installments.reduce((acc, inst) => acc + inst.amount, 0);
  const amountMismatch = mode === 'Installments' && totalInstallmentAmount !== totalFees;

  const handleSave = async () => {
    if (amountMismatch) {
        toast({
            variant: 'destructive',
            title: 'Amount Mismatch',
            description: 'The sum of installments must equal the total fees.',
        });
        return;
    }
    
    try {
        await updateSettings({ studentId: student._id, mode, installments }).unwrap();
        toast({
            title: "Settings Saved",
            description: `Fee settings for ${student.name} have been updated.`,
        });
        onOpenChange(false);
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to save settings.',
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Fee Settings for {student.name}</DialogTitle>
          <DialogDescription>
            Override the default fee payment mode for this student.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? <Skeleton className="h-64 w-full" /> : (
        <div className="space-y-6 py-4">
            <div>
                <Label className="font-semibold">Payment Mode</Label>
                <p className="text-sm text-muted-foreground mb-2">Choose how this student will pay their fees.</p>
                <RadioGroup value={mode} onValueChange={setMode} className="mt-2 grid grid-cols-2 gap-4">
                    <Label htmlFor="full" className="flex items-center space-x-2 p-4 border rounded-md has-[:checked]:border-primary cursor-pointer">
                        <RadioGroupItem value="Full Payment" id="full" />
                        <span className="font-medium">Full Payment</span>
                    </Label>
                    <Label htmlFor="installments" className="flex items-center space-x-2 p-4 border rounded-md has-[:checked]:border-primary cursor-pointer">
                        <RadioGroupItem value="Installments" id="installments" />
                        <span className="font-medium">Installments</span>
                    </Label>
                </RadioGroup>
            </div>

            {mode === 'Installments' && (
                <div className="space-y-4 pt-4">
                    <Separator />
                    <h4 className="font-semibold">Define Installments</h4>
                    <p className="text-sm text-muted-foreground -mt-2">
                        Customize the installment plan for this student.
                    </p>
                    <div className="space-y-4">
                        {installments.map((inst, index) => (
                            <div key={index} className="grid grid-cols-[1fr_120px_140px] gap-3 items-center">
                                <Label className="text-sm text-muted-foreground">{inst.name}</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                                    <Input 
                                        type="number" 
                                        placeholder="Amount"
                                        value={inst.amount || ''}
                                        onChange={(e) => handleInstallmentChange(index, 'amount', e.target.value)}
                                        className="pl-6"
                                    />
                                </div>
                                <Input 
                                    type="date"
                                    value={inst.dueDate ? inst.dueDate.split('T')[0] : ''}
                                    onChange={(e) => handleInstallmentChange(index, 'dueDate', e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end items-center gap-4 pt-4 border-t">
                        <span className="text-sm text-muted-foreground">Total Installment Amount:</span>
                        <span className={`font-bold ${amountMismatch ? 'text-destructive' : 'text-primary'}`}>
                            ${totalInstallmentAmount.toLocaleString()}
                        </span>
                    </div>
                     {amountMismatch && (
                        <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200 [&>svg]:text-yellow-600">
                            <Info className="h-4 w-4" />
                            <AlertTitle>Notice</AlertTitle>
                            <AlertDescription>
                                Sum of installments must equal total fees (${totalFees.toLocaleString()}).
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            )}
        </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Settings'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
