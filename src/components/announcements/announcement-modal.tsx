"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Announcement } from "@/lib/types";
import { Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnouncementModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: Announcement | null;
}

export function AnnouncementModal({ isOpen, onOpenChange, announcement }: AnnouncementModalProps) {
  if (!announcement) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="font-chalkboard bg-[#2C3E50] text-white border-4 border-[#a07a56] shadow-[0_0_20px_rgba(235,225,202,0.4),_inset_0_0_10px_rgba(0,0,0,0.5)] p-8 max-w-3xl"
        style={{ fontFamily: "'Kalam', cursive" }}
      >
        <DialogHeader className="text-center border-b-2 border-dashed border-white/30 pb-4">
          <DialogTitle className="text-4xl text-white tracking-wide">
            {announcement.title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-6 space-y-6 text-lg leading-relaxed tracking-wide">
          <p>{announcement.content}</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-white/70 pt-4 border-t-2 border-dashed border-white/30">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{announcement.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(announcement.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
