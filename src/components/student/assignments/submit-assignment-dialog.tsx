
"use client";

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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Assignment } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface SubmitAssignmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: Assignment;
  onSubmit: (file: File) => void;
}

export function SubmitAssignmentDialog({
  isOpen,
  onOpenChange,
  assignment,
  onSubmit,
}: SubmitAssignmentDialogProps) {
    const [file, setFile] = React.useState<File | null>(null);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if(!file) {
            toast({ title: "No file selected", description: "Please select a file to submit.", variant: "destructive" });
            return;
        }

        setIsProcessing(true);
        // Simulate submission
        setTimeout(() => {
            setIsProcessing(false);
            onSubmit(file);
        }, 1500);
    };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit Assignment: {assignment.title}</DialogTitle>
          <DialogDescription>
            Upload your file for submission. Make sure it's the correct file before submitting.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="assignment-file">Assignment File</Label>
                <Input id="assignment-file" type="file" onChange={handleFileChange} />
            </div>
            {file && <p className="text-sm text-muted-foreground">Selected file: {file.name}</p>}
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!file || isProcessing}>
            {isProcessing ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
