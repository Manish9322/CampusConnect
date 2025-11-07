
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FeeRecord, FeeStatus } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface UpdateFeeStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: FeeRecord;
  onSave: (newStatus: FeeStatus) => void;
}

export function UpdateFeeStatusDialog({
  open,
  onOpenChange,
  record,
  onSave,
}: UpdateFeeStatusDialogProps) {
  const [status, setStatus] = React.useState<FeeStatus>(record.status);
  const { toast } = useToast();

  React.useEffect(() => {
    setStatus(record.status);
  }, [record]);

  const handleSave = () => {
    onSave(status);
    toast({
      title: "Attendance Updated",
      description: `Attendance for ${record.studentName} on ${record.date} has been updated.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Fee Status</DialogTitle>
          <DialogDescription>
            Manually update the payment status for {record.studentName}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right col-span-1">Student</Label>
                <span className="col-span-3 font-medium">{record.studentName}</span>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right col-span-1">Due Amount</Label>
                <span className="col-span-3 font-medium">₹{record.dueAmount.toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                Status
                </Label>
                <Select
                value={status}
                onValueChange={(value) => setStatus(value as FeeStatus)}
                >
                <SelectTrigger id="status" className="col-span-3">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
                </Select>
            </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
