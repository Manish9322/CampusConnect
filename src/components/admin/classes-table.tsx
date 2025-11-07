
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClassWithDetails, Teacher } from "@/lib/types";
import { Edit, PlusCircle, Trash2, ChevronLeft, ChevronRight, Filter, X, Users } from "lucide-react";
import { AddClassDialog } from "./add-class-dialog";
import { DeleteConfirmationDialog } from "../shared/delete-confirmation-dialog";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { useAddClassMutation, useDeleteClassMutation, useGetTeachersQuery, useUpdateClassMutation } from "@/services/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../shared/empty-state";
import { ErrorState } from "../shared/error-state";
import { Card, CardContent } from "../ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ClassesTableProps {
  classes: ClassWithDetails[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function ClassesTable({ classes: initialClasses, isLoading, isError, refetch }: ClassesTableProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [classToAction, setClassToAction] = React.useState<ClassWithDetails | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [showFilters, setShowFilters] = React.useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [yearFilter, setYearFilter] = React.useState<string>("all");
  const [minStudents, setMinStudents] = React.useState<string>("");
  const [maxStudents, setMaxStudents] = React.useState<string>("");
  
  const [addClass, { isLoading: isAdding }] = useAddClassMutation();
  const [updateClass, { isLoading: isUpdating }] = useUpdateClassMutation();
  const [deleteClass] = useDeleteClassMutation();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  const classesWithTeacherNames = initialClasses.map(c => {
    const teacherName = (c.teacherId as Teacher)?.name || 'N/A';
    return { ...c, teacher: teacherName };
  });

  // Get unique years for filter dropdown
  const uniqueYears = React.useMemo(() => {
    const years = Array.from(new Set(classesWithTeacherNames.map(c => c.year)));
    return years.sort((a, b) => a - b);
  }, [classesWithTeacherNames]);

  // Apply all filters
  const filteredClasses = classesWithTeacherNames.filter((c) => {
    // Search filter
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    
    // Year filter
    const matchesYear = yearFilter === "all" || c.year.toString() === yearFilter;
    
    // Student count filter
    const matchesMinStudents = !minStudents || c.studentCount >= parseInt(minStudents);
    const matchesMaxStudents = !maxStudents || c.studentCount <= parseInt(maxStudents);
    
    return matchesSearch && matchesStatus && matchesYear && matchesMinStudents && matchesMaxStudents;
  });

  const totalPages = Math.ceil(filteredClasses.length / rowsPerPage);
  const paginatedClasses = filteredClasses.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    if (value === 'all') {
        setRowsPerPage(filteredClasses.length);
    } else {
        setRowsPerPage(Number(value));
    }
    setPage(0);
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setYearFilter("all");
    setMinStudents("");
    setMaxStudents("");
    setSearchTerm("");
    setPage(0);
  };

  const hasActiveFilters = statusFilter !== "all" || yearFilter !== "all" || minStudents !== "" || maxStudents !== "" || searchTerm !== "";


  const handleEdit = (c: ClassWithDetails) => {
    setClassToAction(c);
    setAddDialogOpen(true);
  };

  const handleAdd = () => {
    setClassToAction(null);
    setAddDialogOpen(true);
  };

  const openDeleteDialog = (c: ClassWithDetails) => {
    setClassToAction(c);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (classToAction) {
        try {
            await deleteClass(classToAction._id!).unwrap();
            toast({ title: "Class Deleted", description: `Class ${classToAction.name} has been deleted.` });
            setDeleteDialogOpen(false);
            setClassToAction(null);
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete class.", variant: "destructive" });
        }
    }
  };

  const handleToggleStatus = async (classData: ClassWithDetails, newStatus: boolean) => {
    const status = newStatus ? "active" : "inactive";
    try {
        await updateClass({ ...classData, status }).unwrap();
        toast({ title: "Status Updated", description: `${classData.name}'s status updated.` });
    } catch (error) {
        toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };
  
   const handleSaveClass = async (classData: any) => {
    try {
        if(classToAction) {
            await updateClass({ _id: classToAction._id, teacherId: (classToAction.teacherId as Teacher)?._id || classToAction.teacherId, ...classData }).unwrap();
            toast({ title: "Class Updated", description: `${classData.name} has been updated.` });
        } else {
            await addClass(classData).unwrap();
            toast({ title: "Class Added", description: `${classData.name} has been added.` });
        }
    } catch(error) {
        toast({ title: "Error", description: "An error occurred while saving the class.", variant: "destructive" });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-5 w-32" /></TableCell>
              <TableCell><Skeleton className="h-5 w-40" /></TableCell>
              <TableCell><Skeleton className="h-5 w-10" /></TableCell>
              <TableCell><Skeleton className="h-6 w-11" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }

    if (isError) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={6}>
              <ErrorState 
                type="error"
                title="Failed to Load Classes"
                description="There was an issue fetching the class data. Please try again."
                onRetry={refetch}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }
    
    if (paginatedClasses.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={6}>
              <EmptyState title="No Classes Found" description="There are no classes matching your criteria." />
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {paginatedClasses.map((c) => (
          <TableRow key={c._id}>
            <TableCell className="font-medium">{c.name}</TableCell>
            <TableCell>{c.teacher}</TableCell>
            <TableCell>
              <TooltipProvider>
                <div className="flex flex-wrap gap-1 items-center">
                  {c.subjects.slice(0, 2).map(sub => (
                    <Badge key={sub} variant="outline" className="text-xs">{sub}</Badge>
                  ))}
                  {c.subjects.length > 2 && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="secondary" className="cursor-default">+ {c.subjects.length - 2} more</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="flex flex-col gap-1 text-xs">
                          {c.subjects.slice(2).map(sub => (
                            <span key={sub}>{sub}</span>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </TooltipProvider>
            </TableCell>
            <TableCell>{c.studentCount}</TableCell>
            <TableCell>
              <Switch
                checked={c.status === "active"}
                onCheckedChange={(checked) => handleToggleStatus(c, checked)}
                aria-label="Toggle class status"
              />
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(c)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openDeleteDialog(c)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  return (
    <>
      <div className="space-y-4 mb-4">
        {/* Search and Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Input
              placeholder="Search by class name or teacher..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full md:max-w-sm"
            />
            <Button
              variant={showFilters ? "default" : "outline"}
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              title="Toggle filters"
              className="shrink-0"
            >
              <Filter className="h-4 w-4" />
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-9 hidden sm:flex"
              >
                <X className="mr-2 h-4 w-4" /> Clear Filters
              </Button>
            )}
          </div>
          <Button onClick={handleAdd} className="w-full sm:w-auto shrink-0">
            <PlusCircle className="mr-2 h-4 w-4" /> 
            <span className="hidden sm:inline">Add Class</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
        
        {/* Mobile Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="w-full sm:hidden"
          >
            <X className="mr-2 h-4 w-4" /> Clear Filters
          </Button>
        )}

        {/* Filters Section */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 p-3 md:p-4 border rounded-lg bg-muted/50">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(0); }}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <Select value={yearFilter} onValueChange={(value) => { setYearFilter(value); setPage(0); }}>
                <SelectTrigger>
                  <SelectValue placeholder="All years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {uniqueYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      Year {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Min Students</label>
              <Input
                type="number"
                placeholder="Min"
                value={minStudents}
                onChange={(e) => { setMinStudents(e.target.value); setPage(0); }}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Students</label>
              <Input
                type="number"
                placeholder="Max"
                value={maxStudents}
                onChange={(e) => { setMaxStudents(e.target.value); setPage(0); }}
                min="0"
              />
            </div>
          </div>
        )}

        {/* Filter Summary */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Showing {filteredClasses.length} of {classesWithTeacherNames.length} classes</span>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Name</TableHead>
              <TableHead>Class Teacher</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>No. of Students</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {renderContent()}
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))
        ) : isError ? (
          <Card>
            <CardContent className="p-6">
              <ErrorState 
                type="error"
                title="Failed to Load Classes"
                description="There was an issue fetching the class data. Please try again."
                onRetry={refetch}
              />
            </CardContent>
          </Card>
        ) : paginatedClasses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <EmptyState title="No Classes Found" description="There are no classes matching your criteria." />
            </CardContent>
          </Card>
        ) : (
          paginatedClasses.map((c) => (
            <Card key={c._id}>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{c.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{c.teacher}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <span className="text-xs text-muted-foreground">
                      {c.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    <Switch
                      checked={c.status === "active"}
                      onCheckedChange={(checked) => handleToggleStatus(c, checked)}
                      aria-label="Toggle class status"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {c.subjects.map(sub => (
                      <Badge key={sub} variant="outline" className="text-xs">
                        {sub}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{c.studentCount} students</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEdit(c)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openDeleteDialog(c)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      {/* Pagination Controls - Responsive */}
      {paginatedClasses.length > 0 && (
         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 mt-4">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
                <Select onValueChange={handleRowsPerPageChange} defaultValue={`${rowsPerPage}`}>
                    <SelectTrigger className="w-20">
                        <SelectValue placeholder={`${rowsPerPage}`} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                    Page {page + 1} of {totalPages || 1}
                </span>
                <div className="flex gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
       )}
      <AddClassDialog
        open={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveClass}
        classData={classToAction}
      />
      {classToAction && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          itemName={classToAction.name}
        />
      )}
    </>
  );
}
