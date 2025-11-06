
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useGetFeeSettingsQuery, useUpdateFeeSettingsMutation } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FeeSettingsProps {
    totalDefinedFees: number;
}

export function FeeSettings({ totalDefinedFees }: FeeSettingsProps) {
    const { data: settings, isLoading } = useGetFeeSettingsQuery({});
    const [updateFeeSettings, { isLoading: isUpdating }] = useUpdateFeeSettingsMutation();
    const { toast } = useToast();

    const [mode, setMode] = React.useState('Full Payment');
    const [installments, setInstallments] = React.useState([
        { name: 'Installment 1', amount: 0, dueDate: '' },
        { name: 'Installment 2', amount: 0, dueDate: '' },
        { name: 'Installment 3', amount: 0, dueDate: '' },
    ]);
    
    React.useEffect(() => {
        if (settings) {
            setMode(settings.mode);
            if (settings.mode === 'Installments' && settings.installments.length > 0) {
                setInstallments(settings.installments);
            } else {
                // Set default due dates if not present
                const today = new Date();
                const defaultInstallments = [
                    { name: 'Installment 1', amount: 0, dueDate: new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString().split('T')[0] },
                    { name: 'Installment 2', amount: 0, dueDate: new Date(today.getFullYear(), today.getMonth() + 4, 1).toISOString().split('T')[0] },
                    { name: 'Installment 3', amount: 0, dueDate: new Date(today.getFullYear(), today.getMonth() + 7, 1).toISOString().split('T')[0] },
                ];
                setInstallments(defaultInstallments);
            }
        }
    }, [settings]);

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
    const amountMismatch = mode === 'Installments' && totalInstallmentAmount !== totalDefinedFees;

    const handleSave = async () => {
        if (amountMismatch) {
            toast({
                variant: 'destructive',
                title: 'Amount Mismatch',
                description: 'The sum of installments must equal the total defined fees.',
            });
            return;
        }
        
        try {
            await updateFeeSettings({ mode, installments }).unwrap();
            toast({
                title: "Settings Saved",
                description: "Default fee payment settings have been updated.",
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to save settings.',
            });
        }
    };
    
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-48 w-full" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Default Fee Settings</CardTitle>
                <CardDescription>Set the default payment mode for all students. This can be overridden for individual students.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label className="font-semibold">Payment Mode</Label>
                    <RadioGroup value={mode} onValueChange={setMode} className="mt-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Full Payment" id="full" />
                            <Label htmlFor="full">Full Payment</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Installments" id="installments" />
                            <Label htmlFor="installments">3 Installments</Label>
                        </div>
                    </RadioGroup>
                </div>

                {mode === 'Installments' && (
                    <div className="space-y-4 p-4 border rounded-lg">
                        <h4 className="font-semibold">Define Installments</h4>
                        {installments.map((inst, index) => (
                            <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                                <div className="space-y-2">
                                    <Label>{inst.name}</Label>
                                    <Input 
                                        type="number" 
                                        placeholder="Amount"
                                        value={inst.amount || ''}
                                        onChange={(e) => handleInstallmentChange(index, 'amount', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                     <Label>Due Date</Label>
                                    <Input 
                                        type="date"
                                        value={inst.dueDate ? inst.dueDate.split('T')[0] : ''}
                                        onChange={(e) => handleInstallmentChange(index, 'dueDate', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-end items-center gap-4 pt-4 border-t">
                            <span className="text-sm text-muted-foreground">Total Installment Amount:</span>
                            <span className="font-bold">
                                ${totalInstallmentAmount.toLocaleString()}
                            </span>
                        </div>
                         {amountMismatch && (
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertTitle>Notice</AlertTitle>
                                <AlertDescription>
                                    The sum of installments (${totalInstallmentAmount}) does not match the total defined fees (${totalDefinedFees}). Please adjust the values.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                )}
                <Button onClick={handleSave} disabled={isUpdating}>
                    {isUpdating ? 'Saving...' : 'Save Default Settings'}
                </Button>
            </CardContent>
        </Card>
    )
}
