
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Teacher } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useGetDepartmentsQuery, useGetDesignationsQuery, useGetSubjectsQuery } from "@/services/api";
import { MultiSelect } from "react-multi-select-component";
import { Skeleton } from "../ui/skeleton";
import { FormDescription } from "../ui/form";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]\d{3}[)])?[\s-]?(\d{3})[\s-]?(\d{4})$/
);

const formSchema = z.object({
  designation: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().regex(phoneRegex, "Invalid phone number format"),
  department: z.string().min(2, "Department is required."),
  courses: z.array(z.object({ label: z.string(), value: z.string() })).min(1, "At least one subject is required."),
  password: z.string().optional(),
  status: z.boolean(),
  profileImage: z.any(),
});

interface AddTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (teacher: Omit<Teacher, '_id'>) => void;
  teacher?: Teacher | null;
}

export function AddTeacherDialog({
  open,
  onOpenChange,
  onSave,
  teacher,
}: AddTeacherDialogProps) {
  const { toast } = useToast();
  const { data: designations = [], isLoading: isLoadingDesignations } = useGetDesignationsQuery({});
  const { data: departments = [], isLoading: isLoadingDepartments } = useGetDepartmentsQuery({});
  const { data: subjects = [], isLoading: isLoadingSubjects } = useGetSubjectsQuery({});

  const subjectOptions = subjects.map((s: any) => ({ label: s.name, value: s._id }));
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      designation: teacher?.designation || "",
      name: teacher?.name || "",
      email: teacher?.email || "",
      phone: teacher?.phone || "",
      department: teacher?.department || "",
      courses: teacher?.subjects?.map(subjectId => {
        const subject = subjects.find((s: any) => s._id === subjectId);
        return { label: subject?.name || subjectId, value: subjectId };
      }) || [],
      password: "",
      status: teacher?.status === "active",
      profileImage: teacher?.profileImage || "",
    },
  });

  React.useEffect(() => {
    form.reset({
      designation: teacher?.designation || "",
      name: teacher?.name || "",
      email: teacher?.email || "",
      phone: teacher?.phone || "",
      department: teacher?.department || "",
      courses: teacher?.subjects?.map(subjectId => {
        const subject = subjects.find((s: any) => s._id === subjectId);
        return { label: subject?.name || subjectId, value: subjectId };
      }) || [],
      password: "",
      status: teacher?.status === "active",
      profileImage: teacher?.profileImage || "",
    });
  }, [teacher, form, subjects]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!teacher && !values.password) {
        form.setError("password", { type: "manual", message: "Password is required for new teachers." });
        return;
    }
    
    // NOTE: This would be where you upload the file. For now, we'll use a placeholder.
    const profileImage = values.profileImage instanceof File 
        ? URL.createObjectURL(values.profileImage) 
        : teacher?.profileImage || "";
        
    const newOrUpdatedTeacher = {
      id: teacher?.id || `TID${Date.now()}`,
      teacherId: teacher?.teacherId || `TID${Date.now()}`,
      role: "teacher" as const,
      ...values,
      status: values.status ? "active" as const : "inactive" as const,
      subjects: values.courses.map((c) => c.value),
      profileImage: profileImage,
    };

    onSave(newOrUpdatedTeacher);
    onOpenChange(false);
  };
  
  const isLoading = isLoadingDesignations || isLoadingDepartments || isLoadingSubjects;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {teacher ? "Edit Teacher" : "Add New Teacher"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to {teacher ? "update the" : "add a new"}{" "}
            teacher.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
            <div className="space-y-4 py-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {designations.map((d: { _id: string, name: string }) => (
                            <SelectItem key={d._id} value={d.name}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                      <Input placeholder="teacher@example.com" {...field} />
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      {teacher ? "Leave blank to keep the current password." : "Set an initial password for the teacher."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {departments.map((d: { _id: string, name: string }) => (
                                <SelectItem key={d._id} value={d.name}>{d.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="courses"
                render={({ field }) => (
                  <FormItem>
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
            </div>
            <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                  </FormControl>
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
                    <FormLabel>Status</FormLabel>
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
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
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
