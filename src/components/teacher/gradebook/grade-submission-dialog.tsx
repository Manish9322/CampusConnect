
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Assignment, Grade, Student } from "@/lib/types";

interface GradeSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
  assignment: Assignment;
  grade: Grade;
  onSave: (updatedGrade: Grade) => void;
  isSaving: boolean;
}

export function GradeSubmissionDialog({
  open,
  onOpenChange,
  student,
  assignment,
  grade,
  onSave,
  isSaving,
}: GradeSubmissionDialogProps) {
  const { toast } = useToast();

  const formSchema = z.object({
    marks: z.coerce.number().min(0, "Marks cannot be negative.").max(assignment.totalMarks, `Marks cannot exceed ${assignment.totalMarks}.`).nullable(),
    feedback: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marks: grade.marks,
      feedback: grade.feedback || "",
    },
  });

  React.useEffect(() => {
    form.reset({
        marks: grade.marks,
        feedback: grade.feedback || "",
    })
  }, [grade, form])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const updatedGrade: Grade = { ...grade, ...values, status: values.marks !== null ? 'Submitted' : grade.status };
    onSave(updatedGrade);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Grade Submission</DialogTitle>
          <DialogDescription>
            Review and grade the submission for <strong>{student.name}</strong> on the assignment <strong>{assignment.title}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            {grade.submissionUrl ? (
                <a href={grade.submissionUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">Download Submission</Button>
                </a>
            ) : (
                <p className="text-sm text-muted-foreground">No file submitted.</p>
            )}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="marks"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Marks (out of {assignment.totalMarks})</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder={`Enter marks`} {...field} onChange={e => field.onChange(e.target.value === '' ? null : e.target.value)} value={field.value ?? ''}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="feedback"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Feedback</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Provide constructive feedback..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Grade"}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

