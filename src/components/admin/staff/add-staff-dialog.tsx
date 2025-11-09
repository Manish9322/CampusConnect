
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const socialLinkSchema = z.object({
  platform: z.enum(['LinkedIn', 'GitHub', 'Twitter']),
  url: z.string().url("Please enter a valid URL."),
});

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  role: z.string().min(2, "Role must be at least 2 characters."),
  image: z.any().optional(),
  socials: z.array(socialLinkSchema).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  staffData?: any | null;
  isSaving: boolean;
}

export function AddStaffDialog({
  open,
  onOpenChange,
  onSave,
  staffData,
  isSaving
}: AddStaffDialogProps) {

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: staffData?.name || "",
      role: staffData?.role || "",
      image: staffData?.image || null,
      socials: staffData?.socials || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socials",
  });
  
  const [imagePreview, setImagePreview] = React.useState(staffData?.image || "");

  React.useEffect(() => {
    if(open) {
      form.reset({
        name: staffData?.name || "",
        role: staffData?.role || "",
        image: staffData?.image || null,
        socials: staffData?.socials || [],
      });
      setImagePreview(staffData?.image || "");
    }
  }, [open, staffData, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (values: FormValues) => {
    const initials = values.name.split(' ').map(n => n[0]).join('');
    onSave({ ...values, initials });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{staffData ? "Edit Staff Member" : "Add New Staff Member"}</DialogTitle>
          <DialogDescription>
            Fill in the details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4 pl-1">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={imagePreview} />
                <AvatarFallback>
                  {form.getValues('name')?.split(' ').map(n=>n[0]).join('') || '?'}
                </AvatarFallback>
              </Avatar>
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem className="flex-1">
                    <FormLabel>Profile Image</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={handleImageChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl><Input placeholder="e.g., Lead Developer" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div>
              <FormLabel>Social Links</FormLabel>
              <div className="space-y-3 mt-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-2">
                      <FormField
                          control={form.control}
                          name={`socials.${index}.platform`}
                          render={({ field }) => (
                            <FormItem className="w-1/3">
                              <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Platform" /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                      <SelectItem value="GitHub">GitHub</SelectItem>
                                      <SelectItem value="Twitter">Twitter</SelectItem>
                                    </SelectContent>
                                  </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                            control={form.control}
                            name={`socials.${index}.url`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => append({ platform: 'LinkedIn', url: '' })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Social Link
                </Button>
              </div>
            </div>
            
            <DialogFooter className="sticky bottom-0 bg-background pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
