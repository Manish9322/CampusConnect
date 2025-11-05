
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddNoteMutation } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface SendNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    _id: string;
    name: string;
    email: string;
    rollNo?: string;
  } | null;
  sender: {
    id?: string;
    name: string;
    role: 'teacher' | 'admin';
  };
}

export function SendNoteDialog({ isOpen, onClose, student, sender }: SendNoteDialogProps) {
  const [addNote, { isLoading }] = useAddNoteMutation();
  const { toast } = useToast();

  const [formData, setFormData] = React.useState({
    subject: "",
    message: "",
    priority: "medium",
    category: "general",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (!isOpen) {
      // Reset form when dialog closes
      setFormData({
        subject: "",
        message: "",
        priority: "medium",
        category: "general",
      });
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    } else if (formData.subject.length > 100) {
      newErrors.subject = "Subject must be less than 100 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (formData.message.length > 1000) {
      newErrors.message = "Message must be less than 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!student) {
      toast({
        title: "Error",
        description: "No student selected",
        variant: "destructive",
      });
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      const noteData = {
        studentId: student._id,
        teacherId: sender.role === 'teacher' ? sender.id : null,
        senderRole: sender.role,
        senderName: sender.name,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        priority: formData.priority,
        category: formData.category,
      };

      await addNote(noteData).unwrap();

      toast({
        title: "Note Sent",
        description: `Note has been sent to ${student.name} successfully.`,
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to send note. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Note to Student</DialogTitle>
          <DialogDescription>
            {student && (
              <span>
                Send a note to <strong>{student.name}</strong> ({student.rollNo || student.email})
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="disciplinary">Disciplinary</SelectItem>
                    <SelectItem value="attendance">Attendance</SelectItem>
                    <SelectItem value="fees">Fees</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject"
                placeholder="Enter subject"
                value={formData.subject}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, subject: e.target.value }));
                  if (errors.subject) {
                    setErrors((prev) => ({ ...prev, subject: "" }));
                  }
                }}
                className={errors.subject ? "border-red-500" : ""}
              />
              {errors.subject && (
                <p className="text-sm text-red-500">{errors.subject}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Enter your message"
                value={formData.message}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, message: e.target.value }));
                  if (errors.message) {
                    setErrors((prev) => ({ ...prev, message: "" }));
                  }
                }}
                rows={6}
                className={errors.message ? "border-red-500" : ""}
              />
              <div className="flex justify-between items-center">
                {errors.message && (
                  <p className="text-sm text-red-500">{errors.message}</p>
                )}
                <p className="text-xs text-muted-foreground ml-auto">
                  {formData.message.length}/1000 characters
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Note"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
