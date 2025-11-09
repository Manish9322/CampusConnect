
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
import { Edit, PlusCircle, Trash2, ChevronLeft, ChevronRight, Github, Linkedin, Twitter, Filter, X } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useAddStaffMutation, useDeleteStaffMutation, useUpdateStaffMutation } from "@/services/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFileUpload } from "@/hooks/use-file-upload";
import { AddStaffDialog } from "./add-staff-dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";

interface StaffTableProps {
  staff: any[];
  isLoading: boolean;
  onFilterChange: (filteredStaff: any[]) => void;
}

const platformIcons: { [key: string]: React.ElementType } = {
  LinkedIn: Linkedin,
  GitHub: Github,
  Twitter: Twitter,
};

export function StaffTable({ staff, isLoading, onFilterChange }: StaffTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [staffToAction, setStaffToAction] = React.useState<any | null>(null);
  const { toast } = useToast();

  const [addStaff, { isLoading: isAdding }] = useAddStaffMutation();
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();
  const { uploadFile, uploading: isUploadingFile } = useFileUpload({ type: 'profile' });
  const isMobile = useIsMobile();

  const roles = React.useMemo(() => ["all", ...Array.from(new Set(staff.map(s => s.role)))], [staff]);

  const filteredStaff = React.useMemo(() => {
    return staff.filter(
      (item) =>
        (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (roleFilter === "all" || item.role === roleFilter)
    );
  }, [staff, searchTerm, roleFilter]);

  React.useEffect(() => {
    onFilterChange(filteredStaff);
  }, [filteredStaff, onFilterChange]);


  const totalPages = Math.ceil(filteredStaff.length / rowsPerPage);
  const paginatedStaff = filteredStaff.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setPage(0);
  };
  
  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setPage(0);
  };

  const isFiltered = searchTerm !== "" || roleFilter !== "all";

  const handleEdit = (item: any) => {
    setStaffToAction(item);
    setAddDialogOpen(true);
  };

  const handleAdd = () => {
    setStaffToAction(null);
    setAddDialogOpen(true);
  };

  const openDeleteDialog = (item: any) => {
    setStaffToAction(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (staffToAction) {
      try {
        await deleteStaff(staffToAction._id).unwrap();
        toast({ title: "Staff Member Deleted" });
        setDeleteDialogOpen(false);
        setStaffToAction(null);
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete staff member.", variant: "destructive" });
      }
    }
  };
  
  const handleSave = async (data: any) => {
    try {
      let imageUrl = data.image;
      if (data.image instanceof File) {
        imageUrl = await uploadFile(data.image);
      }
      
      const payload = { ...data, image: imageUrl };

      if (staffToAction) {
        await updateStaff({ ...payload, _id: staffToAction._id }).unwrap();
        toast({ title: "Staff Member Updated" });
      } else {
        await addStaff(payload).unwrap();
        toast({ title: "Staff Member Added" });
      }
      setAddDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save staff member.", variant: "destructive" });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-5 w-32" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-5 w-40" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }
    
    if (paginatedStaff.length === 0) {
        return (
            <TableBody>
                <TableRow>
                    <TableCell colSpan={5}>
                        <EmptyState title="No Staff Found" description="There are no staff members matching your criteria." />
                    </TableCell>
                </TableRow>
            </TableBody>
        )
    }

    return (
      <TableBody>
        {paginatedStaff.map((item) => (
            <TableRow key={item._id}>
                <TableCell>
                <Avatar>
                    <AvatarImage src={item.image} />
                    <AvatarFallback>{item.initials}</AvatarFallback>
                </Avatar>
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell>
                <div className="flex gap-2">
                    {item.socials.map((social: {platform: string; url: string}, index: number) => {
                        const Icon = platformIcons[social.platform];
                        return Icon ? (
                            <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                <Icon className="h-5 w-5" />
                            </a>
                        ) : null;
                    })}
                </div>
                </TableCell>
                <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(item)}
                >
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                </TableCell>
            </TableRow>
        ))}
      </TableBody>
    );
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search by name or role..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full sm:max-w-xs"
          />
          <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role} value={role}>{role === 'all' ? 'All Roles' : role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isFiltered && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10">
              <X className="mr-2 h-4 w-4"/> Clear
            </Button>
          )}
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Staff Member
        </Button>
      </div>

      {isMobile ? (
        <div className="space-y-4">
            {isLoading ? (
                [...Array(3)].map((_,i) => <Skeleton key={i} className="h-32 w-full rounded-lg"/>)
            ) : paginatedStaff.length === 0 ? (
                <EmptyState title="No Staff Found" description="There are no staff members matching your criteria." />
            ) : (
                paginatedStaff.map(item => (
                    <Card key={item._id}>
                        <CardContent className="p-4 flex gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={item.image} />
                                <AvatarFallback>{item.initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-sm text-muted-foreground">{item.role}</p>
                                <div className="flex gap-2">
                                     {item.socials.map((social: {platform: string; url: string}, index: number) => {
                                        const Icon = platformIcons[social.platform];
                                        return Icon ? (
                                            <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                                <Icon className="h-5 w-5" />
                                            </a>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openDeleteDialog(item)}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Socials</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {renderContent()}
          </Table>
        </div>
      )}
      
      {filteredStaff.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
            <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Rows per page</span>
                <Select onValueChange={handleRowsPerPageChange} defaultValue={`${rowsPerPage}`}>
                    <SelectTrigger className="w-20">
                        <SelectValue placeholder={`${rowsPerPage}`} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                    Page {page + 1} of {totalPages}
                </span>
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
      )}
      
      <AddStaffDialog
        open={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSave}
        staffData={staffToAction}
        isSaving={isAdding || isUpdating || isUploadingFile}
      />
      {staffToAction && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          itemName={staffToAction.name}
        />
      )}
    </>
  );
}
