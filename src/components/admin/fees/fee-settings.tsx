
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
import { Info, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

interface FeeSettingsProps {
    totalDefinedFees: number;
}

export function FeeSettings({ totalDefinedFees }: FeeSettingsProps) {
    const { data: settings, isLoading } = useGetFeeSettingsQuery({});
    const [updateFeeSettings, { isLoading: isUpdating }] = useUpdateFeeSettingsMutation();
    const [isApplyToAllDialogOpen, setApplyToAllDialogOpen] = React.useState(false);
    const [isBulkUpdating, setIsBulkUpdating] = React.useState(false);
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

    const handleApplyToAll = async () => {
        setIsBulkUpdating(true);
        try {
            // First, save the current default settings
            await handleSave();
            
            // Then, trigger the API to apply defaults to all students
            const response = await fetch('/api/settings/apply-to-all-students', {
                method: 'POST'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to apply settings to all students.');
            }

            const result = await response.json();
            
            toast({
                title: "Settings Applied to All",
                description: `Default fee mode has been applied to ${result.updatedCount} students.`,
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Bulk Update Failed',
                description: error.message || 'An error occurred during the bulk update.',
            });
        } finally {
            setIsBulkUpdating(false);
            setApplyToAllDialogOpen(false);
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
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Default Fee Settings</CardTitle>
                    <CardDescription>Set the default payment mode for all students. This can be overridden for individual students.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label className="font-semibold">Payment Mode</Label>
                        <RadioGroup value={mode} onValueChange={setMode} className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Label htmlFor="full" className="flex flex-col space-y-2 p-4 border rounded-md has-[:checked]:border-primary cursor-pointer">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Full Payment" id="full" />
                                    <span className="font-semibold">Full Payment</span>
                                </div>
                                <p className="text-xs text-muted-foreground ml-6">Student pays the entire fee amount in a single transaction.</p>
                            </Label>
                            <Label htmlFor="installments" className="flex flex-col space-y-2 p-4 border rounded-md has-[:checked]:border-primary cursor-pointer">
                                 <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Installments" id="installments" />
                                    <span className="font-semibold">3 Installments</span>
                                </div>
                                <p className="text-xs text-muted-foreground ml-6">Total fee is divided into three scheduled payments.</p>
                            </Label>
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
                                    ₹{totalInstallmentAmount.toLocaleString()}
                                </span>
                            </div>
                            {amountMismatch && (
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>Notice</AlertTitle>
                                    <AlertDescription>
                                        The sum of installments (₹{totalInstallmentAmount.toLocaleString()}) does not match the total defined fees (₹{totalDefinedFees.toLocaleString()}). Please adjust the values.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button onClick={handleSave} disabled={isUpdating}>
                            {isUpdating ? 'Saving...' : 'Save Default Settings'}
                        </Button>
                    </div>
                </CardContent>
                <CardHeader className="border-t">
                    <CardTitle className="text-lg">Bulk Actions</CardTitle>
                    <CardDescription>Apply default settings to all existing students.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-destructive/50 rounded-lg">
                        <div className="flex-1 mb-4 sm:mb-0">
                            <p className="font-semibold">Apply to All Students</p>
                            <p className="text-sm text-muted-foreground">This will reset all individual student fee configurations and apply the saved default mode to everyone.</p>
                        </div>
                        <Button variant="outline" onClick={() => setApplyToAllDialogOpen(true)}>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Apply to All...
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={isApplyToAllDialogOpen} onOpenChange={setApplyToAllDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. It will remove all custom fee settings for every student and apply the new default mode (<strong>{mode}</strong>). It's recommended to save the default settings first.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleApplyToAll} disabled={isBulkUpdating}>
                        {isBulkUpdating ? "Applying..." : "Yes, Apply to All"}
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
