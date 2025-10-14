
"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { useUpdateStudentMutation } from "@/services/api";
import { Student } from "@/lib/types";

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
  profileImage: z.any(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UpdateProfileFormProps {
  student: Student;
  onProfileUpdate: (updatedStudent: Student) => void;
}

export function UpdateProfileForm({ student, onProfileUpdate }: UpdateProfileFormProps) {
  const { toast } = useToast();
  const [updateStudent, { isLoading }] = useUpdateStudentMutation();
  const [avatarPreview, setAvatarPreview] = React.useState(student.profileImage || '');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: student.name,
      email: student.email,
      phone: student.phone,
      profileImage: student.profileImage || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    const profileImage = data.profileImage instanceof File 
      ? URL.createObjectURL(data.profileImage) 
      : student.profileImage;
      
    try {
      const updatedStudent = await updateStudent({ _id: student.id, ...data, profileImage }).unwrap();
      onProfileUpdate(updatedStudent);
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
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('profileImage', file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
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
                    <AvatarImage src={avatarPreview} alt={student.name} />
                    <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <FormLabel>Profile Picture</FormLabel>
                    <Input type="file" accept="image/*" onChange={handleFileChange} />
                    <FormMessage>{form.formState.errors.profileImage?.message as React.ReactNode}</FormMessage>
                </div>
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
