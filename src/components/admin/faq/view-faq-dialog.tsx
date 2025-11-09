
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ViewFaqDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq: { question: string; answer: string } | null;
}

export function ViewFaqDialog({ open, onOpenChange, faq }: ViewFaqDialogProps) {
  if (!faq) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>View FAQ</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div>
                <h3 className="text-sm font-medium text-muted-foreground">Question</h3>
                <p className="font-semibold mt-1">{faq.question}</p>
            </div>
            <div>
                <h3 className="text-sm font-medium text-muted-foreground">Answer</h3>
                <p className="text-sm mt-1">{faq.answer}</p>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
