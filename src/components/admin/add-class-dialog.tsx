
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
import { useGetSubjectsQuery, useGetTeachersQuery } from "@/services/api";
import { Skeleton } from "../ui/skeleton";
import { MultiSelect } from "react-multi-select-component";

const formSchema = z.object({
  name: z.string().min(2, "Class name must be at least 2 characters."),
  teacherId: z.string().nonempty("A teacher must be assigned."),
  subjects: z.array(z.object({ label: z.string(), value: z.string() })).min(1, "At least one subject is required."),
  studentCount: z.coerce.number().min(0, "Number of students cannot be negative."),
  status: z.boolean(),
  year: z.coerce.number().min(2000, "Year must be valid."),
});

interface AddClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (newClass: any) => void;
  classData?: ClassWithDetails | null;
}

export function AddClassDialog({
  open,
  onOpenChange,
  onSave,
  classData,
}: AddClassDialogProps) {
  const { toast } = useToast();
  const { data: allTeachers = [], isLoading: isLoadingTeachers } = useGetTeachersQuery();
  const { data: allSubjects = [], isLoading: isLoadingSubjects } = useGetSubjectsQuery();

  const subjectOptions = allSubjects.map((s: { name: string; _id: string; }) => ({ label: s.name, value: s.name }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: classData?.name || "",
      teacherId: classData?.teacherId || "",
      subjects: classData?.subjects.map(s => ({ label: s, value: s })) || [],
      studentCount: classData?.studentCount || 0,
      status: classData?.status === 'active',
      year: classData?.year || new Date().getFullYear(),
    },
  });

  React.useEffect(() => {
    form.reset({
        name: classData?.name || "",
        teacherId: classData?.teacherId || "",
        subjects: classData?.subjects.map(s => ({ label: s, value: s })) || [],
        studentCount: classData?.studentCount || 0,
        status: classData?.status === 'active',
        year: classData?.year || new Date().getFullYear(),
    });
  }, [classData, allTeachers, form]);


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({
        ...values,
        subjects: values.subjects.map(s => s.value),
        status: values.status ? 'active' : 'inactive',
    });
    onOpenChange(false);
  };
  
  const isLoading = isLoadingTeachers || isLoadingSubjects;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{classData ? "Edit Class" : "Add New Class"}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {classData ? "update the" : "add a new"} class.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
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
                    <FormLabel>Class Teacher</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allTeachers.map((teacher: Teacher) => (
                          <SelectItem key={teacher._id} value={teacher._id!}>{teacher.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="subjects"
                    render={({ field }) => (
                    <FormItem className="md:col-span-1">
                        <FormLabel>Subjects</FormLabel>
                        <FormControl>
                            <MultiSelect
                                options={subjectOptions}
                                value={field.value}
                                onChange={field.onChange}
                                labelledBy="Select Subjects"
                                hasSelectAll={false}
                            />
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
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2024" {...field} />
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

    