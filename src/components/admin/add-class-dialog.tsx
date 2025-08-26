
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
import { useToast } from "@/hooks/use-toast";
import { ClassWithDetails, Teacher } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";

const formSchema = z.object({
  name: z.string().min(2, "Class name must be at least 2 characters."),
  teacherId: z.string().nonempty("A teacher must be assigned."),
  subjects: z.string().min(1, "At least one subject is required."),
  studentCount: z.coerce.number().min(0, "Number of students cannot be negative."),
  status: z.boolean(),
});

interface AddClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (newClass: any) => void;
  classData?: ClassWithDetails | null;
  allTeachers: Teacher[];
}

export function AddClassDialog({
  open,
  onOpenChange,
  onSave,
  classData,
  allTeachers,
}: AddClassDialogProps) {
  const { toast } = useToast();
  
  const defaultTeacher = allTeachers.find(t => t.name === classData?.teacher);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: classData?.name || "",
      teacherId: defaultTeacher?.id || "",
      subjects: classData?.subjects.join(', ') || "",
      studentCount: classData?.studentCount || 0,
      status: classData?.status === 'active',
    },
  });

  React.useEffect(() => {
    const defaultTeacher = allTeachers.find(t => t.name === classData?.teacher);
    form.reset({
        name: classData?.name || "",
        teacherId: defaultTeacher?.id || "",
        subjects: classData?.subjects.join(', ') || "",
        studentCount: classData?.studentCount || 0,
        status: classData?.status === 'active',
    });
  }, [classData, allTeachers, form]);


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
    toast({
      title: classData ? "Class Updated" : "Class Added",
      description: `Class ${values.name} has been successfully ${classData ? 'updated' : 'added'}.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{classData ? "Edit Class" : "Add New Class"}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {classData ? "update the" : "add a new"} class.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 10A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Teacher</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allTeachers.map(teacher => (
                          <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="subjects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subjects (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Math, Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Students</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Status</FormLabel>
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
      </DialogContent>
    </Dialog>
  );
}
