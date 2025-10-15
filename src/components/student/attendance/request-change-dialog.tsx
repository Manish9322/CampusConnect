
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AttendanceRecord, AttendanceStatus } from "@/lib/types";

interface RequestChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: AttendanceRecord;
  onSave: (data: { requestedStatus: AttendanceStatus; reason: string }) => void;
}

const formSchema = z.object({
    requestedStatus: z.enum(["present", "late", "absent"]),
    reason: z.string().min(10, "Reason must be at least 10 characters.").max(200, "Reason must be less than 200 characters.")
});

export function RequestChangeDialog({ open, onOpenChange, record, onSave }: RequestChangeDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestedStatus: record.status,
      reason: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Attendance Change</DialogTitle>
          <DialogDescription>
            Request a change for your attendance on {new Date(record.date).toLocaleDateString()} for {record.course}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <p className="text-sm">Your current status is marked as: <strong>{record.status.charAt(0).toUpperCase() + record.status.slice(1)}</strong></p>
                <FormField
                control={form.control}
                name="requestedStatus"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Requested Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select new status" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="present">Present</SelectItem>
                                <SelectItem value="late">Late</SelectItem>
                                <SelectItem value="absent">Absent</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Reason for Change</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Explain why you are requesting this change..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                 <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit">Submit Request</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
