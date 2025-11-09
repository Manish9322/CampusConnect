
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Building, Milestone, Rocket, Users } from "lucide-react";

const formSchema = z.object({
  year: z.string().min(4, "Year must be at least 4 characters.").max(10, "Year must be less than 10 characters."),
  title: z.string().min(5, "Title must be at least 5 characters.").max(30, "Title must be less than 30 characters."),
  description: z.string().min(10, "Description must be at least 10 characters.").max(150, "Description must be less than 150 characters."),
  icon: z.string().nonempty("An icon is required."),
});

interface AddJourneyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: z.infer<typeof formSchema>) => void;
  itemData?: any | null;
  isSaving: boolean;
}

const icons = [
  { name: 'Milestone', icon: <Milestone/> },
  { name: 'Rocket', icon: <Rocket/> },
  { name: 'Building', icon: <Building/> },
  { name: 'Users', icon: <Users/> },
  { name: 'Briefcase', icon: <Briefcase/> },
];

export function AddJourneyDialog({
  open,
  onOpenChange,
  onSave,
  itemData,
  isSaving,
}: AddJourneyDialogProps) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: itemData?.year || "",
      title: itemData?.title || "",
      description: itemData?.description || "",
      icon: itemData?.icon || "Milestone",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        year: itemData?.year || "",
        title: itemData?.title || "",
        description: itemData?.description || "",
        icon: itemData?.icon || "Milestone",
      });
    }
  }, [open, itemData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
  };
  
  const titleValue = form.watch("title");
  const descriptionValue = form.watch("description");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{itemData ? "Edit Milestone" : "Add New Milestone"}</DialogTitle>
          <DialogDescription>
            Fill in the details for the timeline item. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl><Input placeholder="e.g., 2024" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Icon</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an icon" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {icons.map((item) => (
                                        <SelectItem key={item.name} value={item.name}>
                                            <div className="flex items-center gap-2">
                                                {item.icon}
                                                <span>{item.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The Idea Was Born" {...field} />
                  </FormControl>
                  <div className="text-right text-xs text-muted-foreground">{titleValue.length}/30</div>
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
                    <Textarea placeholder="A brief description of the milestone..." {...field} />
                  </FormControl>
                   <div className="text-right text-xs text-muted-foreground">{descriptionValue.length}/150</div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Milestone"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
