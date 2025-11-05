
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetNotesQuery, useUpdateNoteMutation } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Mail, 
  MailOpen, 
  X, 
  AlertCircle,
  BookOpen,
  AlertTriangle,
  CalendarClock,
  DollarSign,
  FileText,
  Award
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

// Mock student ID - In production, get this from auth context
const STUDENT_ID = "67761e9efc4dab3c73e86d09"; // Replace with actual logged-in student ID

const priorityConfig = {
  low: { color: "bg-blue-500", label: "Low", icon: Bell },
  medium: { color: "bg-yellow-500", label: "Medium", icon: Clock },
  high: { color: "bg-orange-500", label: "High", icon: AlertCircle },
  urgent: { color: "bg-red-500", label: "Urgent", icon: AlertTriangle },
};

const categoryConfig = {
  general: { label: "General", icon: FileText, color: "text-gray-600" },
  academic: { label: "Academic", icon: BookOpen, color: "text-blue-600" },
  disciplinary: { label: "Disciplinary", icon: AlertTriangle, color: "text-red-600" },
  attendance: { label: "Attendance", icon: CalendarClock, color: "text-orange-600" },
  fees: { label: "Fees", icon: DollarSign, color: "text-green-600" },
  achievement: { label: "Achievement", icon: Award, color: "text-purple-600" },
};

export default function StudentNotesPage() {
  const { data: notes = [], isLoading, refetch } = useGetNotesQuery({ studentId: STUDENT_ID });
  const [updateNote] = useUpdateNoteMutation();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [readFilter, setReadFilter] = React.useState<string>("all");
  const [selectedNote, setSelectedNote] = React.useState<any>(null);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = React.useState(false);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const total = notes.length;
    const unread = notes.filter((n: any) => !n.isRead).length;
    const urgent = notes.filter((n: any) => n.priority === 'urgent' && !n.isRead).length;
    const today = new Date().toDateString();
    const todayNotes = notes.filter((n: any) => new Date(n.createdAt).toDateString() === today).length;
    
    return { total, unread, urgent, todayNotes };
  }, [notes]);

  // Filter notes
  const filteredNotes = React.useMemo(() => {
    return notes.filter((note: any) => {
      const matchesSearch = 
        searchTerm === "" ||
        note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.senderName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPriority = priorityFilter === "all" || note.priority === priorityFilter;
      const matchesCategory = categoryFilter === "all" || note.category === categoryFilter;
      const matchesRead = 
        readFilter === "all" ||
        (readFilter === "read" && note.isRead) ||
        (readFilter === "unread" && !note.isRead);
      
      return matchesSearch && matchesPriority && matchesCategory && matchesRead;
    });
  }, [notes, searchTerm, priorityFilter, categoryFilter, readFilter]);

  const handleMarkAsRead = async (noteId: string) => {
    try {
      await updateNote({ _id: noteId, isRead: true }).unwrap();
      toast({
        title: "Note marked as read",
        description: "The note has been marked as read.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark note as read. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewNote = async (note: any) => {
    setSelectedNote(note);
    setIsNoteDialogOpen(true);
    
    // Mark as read when viewing
    if (!note.isRead) {
      await handleMarkAsRead(note._id);
    }
  };

  const isFiltered = searchTerm !== "" || priorityFilter !== "all" || categoryFilter !== "all" || readFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setPriorityFilter("all");
    setCategoryFilter("all");
    setReadFilter("all");
  };

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6 p-4 md:p-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">My Notes</h1>
          <p className="text-sm text-muted-foreground">Messages and notifications from your teachers</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <MailOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unread}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.urgent}</div>
            <p className="text-xs text-muted-foreground">Requires immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayNotes}</div>
            <p className="text-xs text-muted-foreground">Received today</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-xs"
            />
            <Select value={readFilter} onValueChange={setReadFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Read status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Notes</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="attendance">Attendance</SelectItem>
                <SelectItem value="disciplinary">Disciplinary</SelectItem>
                <SelectItem value="fees">Fees</SelectItem>
                <SelectItem value="achievement">Achievement</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
            {isFiltered && (
              <Button variant="ghost" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" /> Clear
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {filteredNotes.length === 0 ? (
            <EmptyState
              title="No Notes Found"
              description={
                isFiltered
                  ? "No notes match your current filters."
                  : "You haven't received any notes yet."
              }
            />
          ) : (
            <div className="space-y-3">
              {filteredNotes.map((note: any) => {
                const PriorityIcon = priorityConfig[note.priority as keyof typeof priorityConfig].icon;
                const CategoryIcon = categoryConfig[note.category as keyof typeof categoryConfig].icon;
                
                return (
                  <Card
                    key={note._id}
                    className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                      !note.isRead ? "border-l-4 border-l-primary bg-accent/20" : ""
                    }`}
                    onClick={() => handleViewNote(note)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-base">{note.subject}</h3>
                            {!note.isRead && (
                              <Badge variant="default" className="text-xs">
                                New
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={`text-xs ${priorityConfig[note.priority as keyof typeof priorityConfig].color}`}
                            >
                              <PriorityIcon className="h-3 w-3 mr-1" />
                              {priorityConfig[note.priority as keyof typeof priorityConfig].label}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <CategoryIcon className={`h-3 w-3 mr-1 ${categoryConfig[note.category as keyof typeof categoryConfig].color}`} />
                              {categoryConfig[note.category as keyof typeof categoryConfig].label}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {note.message}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>From: {note.senderName}</span>
                            <span>•</span>
                            <span>{format(new Date(note.createdAt), "MMM dd, yyyy 'at' hh:mm a")}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          {note.isRead && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Note Detail Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedNote?.subject}
              {selectedNote && !selectedNote.isRead && (
                <Badge variant="default" className="text-xs">New</Badge>
              )}
            </DialogTitle>
            <DialogDescription className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap mt-2">
                {selectedNote && (
                  <>
                    <Badge
                      variant="outline"
                      className={priorityConfig[selectedNote.priority as keyof typeof priorityConfig].color}
                    >
                      {priorityConfig[selectedNote.priority as keyof typeof priorityConfig].label} Priority
                    </Badge>
                    <Badge variant="secondary">
                      {categoryConfig[selectedNote.category as keyof typeof categoryConfig].label}
                    </Badge>
                  </>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          {selectedNote && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">From</p>
                  <p className="font-medium">{selectedNote.senderName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedNote.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm whitespace-pre-wrap">{selectedNote.message}</p>
              </div>

              {selectedNote.readAt && (
                <div className="text-xs text-muted-foreground border-t pt-2">
                  Read on {format(new Date(selectedNote.readAt), "MMM dd, yyyy 'at' hh:mm a")}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
