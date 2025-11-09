
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
import { Edit, PlusCircle, Trash2, ChevronLeft, ChevronRight, Github, Linkedin, Twitter } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useAddStaffMutation, useDeleteStaffMutation, useUpdateStaffMutation } from "@/services/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFileUpload } from "@/hooks/use-file-upload";
import { AddStaffDialog } from "./add-staff-dialog";

interface StaffTableProps {
  staff: any[];
  isLoading: boolean;
}

const platformIcons: { [key: string]: React.ElementType } = {
  LinkedIn: Linkedin,
  GitHub: Github,
  Twitter: Twitter,
};

export function StaffTable({ staff, isLoading }: StaffTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [staffToAction, setStaffToAction] = React.useState<any | null>(null);
  const { toast } = useToast();

  const [addStaff, { isLoading: isAdding }] = useAddStaffMutation();
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();
  const { uploadFile, uploading: isUploadingFile } = useFileUpload({ type: 'profile' });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredStaff = staff.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    
    if (filteredStaff.length === 0) {
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
        {filteredStaff.map((item) => {
           const Icon1 = item.socials[0] ? platformIcons[item.socials[0].platform] : null;
           const Icon2 = item.socials[1] ? platformIcons[item.socials[1].platform] : null;

           return (
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
           )
        })}
      </TableBody>
    );
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <Input
          placeholder="Search by name or role..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full md:max-w-sm"
        />
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </div>
      
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
