
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useAddTestimonialMutation } from "@/services/api";

const MAX_WORDS = 20;

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  designation: z.string().optional(),
  quote: z.string()
    .min(10, "Feedback must be at least 10 characters.")
    .refine(value => value.split(/\s+/).filter(Boolean).length <= MAX_WORDS, {
      message: `Feedback must be no more than ${MAX_WORDS} words.`
    }),
});

interface FeedbackModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackModal({ isOpen, onOpenChange }: FeedbackModalProps) {
  const { toast } = useToast();
  const [addTestimonial, { isLoading }] = useAddTestimonialMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      designation: "",
      quote: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const initials = values.name.split(' ').map(n => n[0]).join('');
      await addTestimonial({ ...values, initials, approved: false }).unwrap();
      toast({
        title: "Feedback Submitted!",
        description: "Thank you for your valuable feedback. It will be reviewed by our team.",
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error submitting your feedback. Please try again.",
      });
    }
  };

  const quoteValue = form.watch("quote");
  const wordCount = quoteValue.split(/\s+/).filter(Boolean).length;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            We'd love to hear your thoughts about CampusConnect.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
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
                  <FormLabel>Your Role (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Professor of Physics, CS Student" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback / Testimonial</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us what you think..."
                      {...field}
                    />
                  </FormControl>
                  <div className="text-right text-xs text-muted-foreground">
                    {wordCount}/{MAX_WORDS} words
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
