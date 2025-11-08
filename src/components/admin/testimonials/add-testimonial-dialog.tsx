
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const MAX_WORDS = 20;

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  designation: z.string().optional(),
  quote: z.string()
    .min(10, "Quote must be at least 10 characters.")
    .refine(value => value.split(/\s+/).filter(Boolean).length <= MAX_WORDS, {
      message: `Quote must be no more than ${MAX_WORDS} words.`
    }),
  avatar: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  approved: z.boolean(),
});

interface AddTestimonialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  testimonialData?: any | null;
}

export function AddTestimonialDialog({
  open,
  onOpenChange,
  onSave,
  testimonialData,
}: AddTestimonialDialogProps) {
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: testimonialData?.name || "",
      designation: testimonialData?.designation || "",
      quote: testimonialData?.quote || "",
      avatar: testimonialData?.avatar || "",
      approved: testimonialData?.approved || false,
    },
  });

  React.useEffect(() => {
    form.reset({
      name: testimonialData?.name || "",
      designation: testimonialData?.designation || "",
      quote: testimonialData?.quote || "",
      avatar: testimonialData?.avatar || "",
      approved: testimonialData?.approved || false,
    });
  }, [testimonialData, form]);


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const initials = values.name.split(' ').map(n => n[0]).join('');
    onSave({ ...values, initials });
  };
  
  const quoteValue = form.watch("quote");
  const wordCount = quoteValue.split(/\s+/).filter(Boolean).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{testimonialData ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
          <DialogDescription>
            Fill in the details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Professor of Physics" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="quote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quote / Feedback</FormLabel>
                  <FormControl>
                    <Textarea placeholder="The testimonial content..." {...field} className="min-h-[100px]" />
                  </FormControl>
                  <div className="text-right text-xs text-muted-foreground">
                    {wordCount}/{MAX_WORDS} words
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="approved"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Approve</FormLabel>
                    <FormDescription>
                      Make this testimonial visible on the public website.
                    </FormDescription>
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
