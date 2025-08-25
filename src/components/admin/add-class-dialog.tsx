"use client";

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
import { useToast } from "@/hooks/use-toast";
import { Class } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(2, "Class name must be at least 2 characters."),
  year: z.coerce.number().min(2000, "Year must be 2000 or later."),
});

interface AddClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddClass: (newClass: Omit<Class, "id">) => void;
  classData?: Class | null;
}

export function AddClassDialog({
  open,
  onOpenChange,
  onAddClass,
  classData,
}: AddClassDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: classData?.name || "",
      year: classData?.year || new Date().getFullYear(),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onAddClass(values);
    toast({
      title: classData ? "Class Updated" : "Class Added",
      description: `Class ${values.name} has been successfully ${classData ? 'updated' : 'added'}.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{classData ? "Edit Class" : "Add New Class"}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {classData ? "update the" : "add a new"} class.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CS101" {...field} />
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
