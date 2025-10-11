
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Student, Class } from "@/lib/types";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useGetClassesQuery } from "@/services/api";
import { Skeleton } from "../ui/skeleton";


const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]\d{3}[)])?[\s-]?(\d{3})[\s-]?(\d{4})$/
);

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  rollNo: z.string().min(1, "Roll number is required."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().regex(phoneRegex, "Invalid phone number format"),
  classId: z.string().nonempty("A class must be assigned."),
  status: z.boolean(),
});

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (newStudent: any) => void;
  studentData?: Student | null;
}

export function AddStudentDialog({
  open,
  onOpenChange,
  onSave,
  studentData,
}: AddStudentDialogProps) {
  const { data: classes = [], isLoading: isLoadingClasses } = useGetClassesQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: studentData?.name || "",
      rollNo: studentData?.rollNo || "",
      email: studentData?.email || "",
      phone: studentData?.phone || "",
      classId: studentData?.classId || undefined,
      status: studentData?.status === 'active',
    },
  });

  React.useEffect(() => {
    form.reset({
        name: studentData?.name || "",
        rollNo: studentData?.rollNo || "",
        email: studentData?.email || "",
        phone: studentData?.phone || "",
        classId: studentData?.classId || undefined,
        status: studentData?.status === 'active',
    });
  }, [studentData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({
      ...values,
      status: values.status ? 'active' : 'inactive'
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{studentData ? "Edit Student" : "Add New Student"}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {studentData ? "update the" : "add a new"} student.
          </DialogDescription>
        </DialogHeader>
        {isLoadingClasses ? (
             <div className="space-y-4 py-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="rollNo"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Roll Number</FormLabel>
                    <FormControl>
                        <Input placeholder="CS-001" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="student@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                        <Input placeholder="123-456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes.map((c: Class) => (
                        <SelectItem key={c._id} value={c._id!}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Status (Active)</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
