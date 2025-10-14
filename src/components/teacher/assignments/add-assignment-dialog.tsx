
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Assignment, AssignmentType, Class } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().optional(),
  courseName: z.string({ required_error: "Please select a class." }),
  type: z.enum(['Assignment', 'Quiz', 'Exam']),
  dueDate: z.date({ required_error: "A due date is required." }),
  totalMarks: z.coerce.number().min(1, "Total marks must be at least 1."),
  attachments: z.any().optional(),
});

interface AddAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  assignmentData?: Assignment | null;
  teacherClasses: Class[];
}

const assignmentTypes: AssignmentType[] = ['Assignment', 'Quiz', 'Exam'];

export function AddAssignmentDialog({
  open,
  onOpenChange,
  onSave,
  assignmentData,
  teacherClasses,
}: AddAssignmentDialogProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: assignmentData?.title || "",
      description: assignmentData?.description || "",
      courseName: assignmentData?.courseName || undefined,
      type: assignmentData?.type || "Assignment",
      dueDate: assignmentData ? new Date(assignmentData.dueDate) : undefined,
      totalMarks: assignmentData?.totalMarks || 100,
      attachments: assignmentData?.attachments || [],
    },
  });

  React.useEffect(() => {
    form.reset({
      title: assignmentData?.title || "",
      description: assignmentData?.description || "",
      courseName: assignmentData?.courseName || undefined,
      type: assignmentData?.type || "Assignment",
      dueDate: assignmentData ? new Date(assignmentData.dueDate) : new Date(),
      totalMarks: assignmentData?.totalMarks || 100,
      attachments: assignmentData?.attachments || [],
    });
  }, [assignmentData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, you'd handle file uploads to a storage service here.
    // For now, we'll just mock the attachment data structure.
    const attachments = values.attachments?.[0] 
        ? [{ name: values.attachments[0].name, url: URL.createObjectURL(values.attachments[0]) }] 
        : [];

    const courseId = teacherClasses.find(c => c.name === values.courseName)?._id || '';
    const saveData = { ...values, courseId, dueDate: values.dueDate.toISOString().split('T')[0], attachments };
    
    onSave(saveData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{assignmentData ? "Edit Assignment" : "Create New Assignment"}</DialogTitle>
          <DialogDescription>
            Fill in the details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Chapter 5 Problem Set" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Provide instructions for the assignment..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="courseName"
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
                        {teacherClasses.map(c => (
                            <SelectItem key={c._id} value={c.name}>{c.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {assignmentTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="totalMarks"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Total Marks</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 100" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
             </div>
              <FormField
                control={form.control}
                name="attachments"
                render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                        <FormLabel>Attachment</FormLabel>
                        <FormControl>
                            <Input type="file" onChange={e => onChange(e.target.files)} {...rest} />
                        </FormControl>
                         <FormDescription>
                            Attach a file for this assignment (e.g., worksheet, reading material).
                        </FormDescription>
                        <FormMessage />
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
      </DialogContent>
    </Dialog>
  );
}
