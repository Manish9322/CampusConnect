
"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { useUpdateTeacherMutation } from "@/services/api";
import { Teacher } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]\d{3}[)])?[\s-]?(\d{3})[\s-]?(\d{4})$/
);

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().regex(phoneRegex, "Invalid phone number format"),
  profileImage: z.string().url("Please enter a valid URL.").or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UpdateProfileFormProps {
  teacher: Teacher;
  onProfileUpdate: (updatedTeacher: Teacher) => void;
}

export function UpdateProfileForm({ teacher, onProfileUpdate }: UpdateProfileFormProps) {
  const { toast } = useToast();
  const [updateTeacher, { isLoading }] = useUpdateTeacherMutation();
  const [avatarPreview, setAvatarPreview] = React.useState(teacher.profileImage || '');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      profileImage: teacher.profileImage || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const updatedTeacher = await updateTeacher({ _id: teacher._id, ...data }).unwrap();
      onProfileUpdate(updatedTeacher);
      toast({
        title: "Profile Updated",
        description: "Your personal information has been successfully updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "An error occurred while updating your profile.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details here.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarPreview} alt={teacher.name} />
                    <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <FormField
                    control={form.control}
                    name="profileImage"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>Profile Image URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/image.png" {...field} onChange={(e) => {
                                field.onChange(e);
                                setAvatarPreview(e.target.value);
                            }}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" {...field} disabled />
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
                    <Input placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
