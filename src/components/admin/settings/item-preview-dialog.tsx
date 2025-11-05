
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

interface ItemPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: { name: string; description?: string } | null;
  type: "subject" | "department" | "designation" | "announcementCategory" | null;
}

export function ItemPreviewDialog({ open, onOpenChange, item, type }: ItemPreviewDialogProps) {
  if (!item || !type) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>View {type.charAt(0).toUpperCase() + type.slice(1)}</DialogTitle>
          <DialogDescription>
            Details for {item.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p className="font-semibold">{item.name}</p>
            </div>
            {item.description && (
                 <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <p className="text-sm">{item.description}</p>
                </div>
            )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
