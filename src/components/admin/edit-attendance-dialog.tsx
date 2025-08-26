
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
import { AttendanceRecord, AttendanceStatus } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface EditAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: AttendanceRecord;
  onSave: (record: AttendanceRecord) => void;
}

export function EditAttendanceDialog({
  open,
  onOpenChange,
  record,
  onSave,
}: EditAttendanceDialogProps) {
  const [status, setStatus] = React.useState<AttendanceStatus>(record.status);
  const { toast } = useToast();

  React.useEffect(() => {
    setStatus(record.status);
  }, [record]);

  const handleSave = () => {
    onSave({ ...record, status });
    toast({
      title: "Attendance Updated",
      description: `Attendance for ${record.studentName} on ${record.date} has been updated.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Attendance</DialogTitle>
          <DialogDescription>
            Update the attendance status for {record.studentName}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Student</Label>
            <span className="col-span-3 font-medium">{record.studentName}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Course</Label>
            <span className="col-span-3 font-medium">{record.course}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date</Label>
            <span className="col-span-3 font-medium">{record.date}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as AttendanceStatus)}
            >
              <SelectTrigger id="status" className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
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
