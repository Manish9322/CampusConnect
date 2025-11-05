
"use client"

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2, Edit, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetSubjectsQuery, useAddSubjectMutation, useDeleteSubjectMutation, useUpdateSubjectMutation, useGetDepartmentsQuery, useAddDepartmentMutation, useDeleteDepartmentMutation, useUpdateDepartmentMutation, useGetDesignationsQuery, useAddDesignationMutation, useDeleteDesignationMutation, useUpdateDesignationMutation, useGetAnnouncementCategoriesQuery, useAddAnnouncementCategoryMutation, useUpdateAnnouncementCategoryMutation, useDeleteAnnouncementCategoryMutation } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ItemPreviewDialog } from "@/components/admin/settings/item-preview-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Item = {
    _id: string;
    name: string;
    description?: string;
}

type ItemToModify = Item | null;
type ItemType = "subject" | "department" | "designation" | "announcementCategory";

export default function SettingsPage() {
    const [newSubject, setNewSubject] = React.useState({ name: "", description: "" });
    const [newDepartment, setNewDepartment] = React.useState({ name: "", description: "" });
    const [newDesignation, setNewDesignation] = React.useState({ name: "", description: "" });
    const [newAnnouncementCategory, setNewAnnouncementCategory] = React.useState({ name: "", description: "" });
    
    const [itemToEdit, setItemToEdit] = React.useState<ItemToModify>(null);
    const [editName, setEditName] = React.useState("");
    const [editDescription, setEditDescription] = React.useState("");
    const [editType, setEditType] = React.useState<ItemType | null>(null);
    
    const [itemToView, setItemToView] = React.useState<ItemToModify>(null);
    const [viewType, setViewType] = React.useState<ItemType | null>(null);

    const { toast } = useToast();

    const { data: subjects = [], isLoading: isLoadingSubjects } = useGetSubjectsQuery(undefined);
    const [addSubject, { isLoading: isAddingSubject }] = useAddSubjectMutation();
    const [updateSubject, { isLoading: isUpdatingSubject }] = useUpdateSubjectMutation();
    const [deleteSubject] = useDeleteSubjectMutation();

    const { data: departments = [], isLoading: isLoadingDepartments } = useGetDepartmentsQuery(undefined);
    const [addDepartment, { isLoading: isAddingDepartment }] = useAddDepartmentMutation();
    const [updateDepartment, { isLoading: isUpdatingDepartment }] = useUpdateDepartmentMutation();
    const [deleteDepartment] = useDeleteDepartmentMutation();

    const { data: designations = [], isLoading: isLoadingDesignations } = useGetDesignationsQuery(undefined);
    const [addDesignation, { isLoading: isAddingDesignation }] = useAddDesignationMutation();
    const [updateDesignation, { isLoading: isUpdatingDesignation }] = useUpdateDesignationMutation();
    const [deleteDesignation] = useDeleteDesignationMutation();

    const { data: announcementCategories = [], isLoading: isLoadingAnnouncementCategories } = useGetAnnouncementCategoriesQuery(undefined);
    const [addAnnouncementCategory, { isLoading: isAddingAnnouncementCategory }] = useAddAnnouncementCategoryMutation();
    const [updateAnnouncementCategory, { isLoading: isUpdatingAnnouncementCategory }] = useUpdateAnnouncementCategoryMutation();
    const [deleteAnnouncementCategory] = useDeleteAnnouncementCategoryMutation();

    const openEditDialog = (item: ItemToModify, type: ItemType) => {
        setItemToEdit(item);
        setEditName(item?.name || "");
        setEditDescription(item?.description || "");
        setEditType(type);
    };

    const closeEditDialog = () => {
        setItemToEdit(null);
        setEditName("");
        setEditDescription("");
        setEditType(null);
    };
    
    const openPreviewDialog = (item: ItemToModify, type: ItemType) => {
        setItemToView(item);
        setViewType(type);
    };

    const closePreviewDialog = () => {
        setItemToView(null);
        setViewType(null);
    };

    const handleSave = async () => {
        if (!itemToEdit || !editType) return;
        
        try {
            const updatedData = { _id: itemToEdit._id, name: editName, description: editDescription };
            if (editType === 'subject') {
                await updateSubject(updatedData).unwrap();
            } else if (editType === 'department') {
                await updateDepartment(updatedData).unwrap();
            } else if (editType === 'designation') {
                await updateDesignation(updatedData).unwrap();
            } else if (editType === 'announcementCategory') {
                await updateAnnouncementCategory(updatedData).unwrap();
            }
            toast({ title: `${editType.charAt(0).toUpperCase() + editType.slice(1)} Updated`, description: `"${editName}" has been updated.` });
            closeEditDialog();
        } catch (error) {
            toast({ title: "Error", description: "Failed to update item.", variant: "destructive" });
        }
    };


    const handleAddSubject = async () => {
        if (newSubject.name.trim()) {
            try {
                await addSubject({ name: newSubject.name.trim(), description: newSubject.description.trim() }).unwrap();
                toast({ title: "Subject Added", description: `"${newSubject.name.trim()}" has been added.` });
                setNewSubject({ name: "", description: "" });
            } catch (error) {
                toast({ title: "Error", description: "Failed to add subject.", variant: "destructive" });
            }
        }
    };

    const handleRemoveSubject = async (subject: { _id: string, name: string }) => {
        try {
            await deleteSubject(subject._id).unwrap();
            toast({ title: "Subject Removed", description: `"${subject.name}" has been removed.` });
        } catch (error) {
            toast({ title: "Error", description: "Failed to remove subject.", variant: "destructive" });
        }
    };

    const handleAddDepartment = async () => {
        if (newDepartment.name.trim()) {
            try {
                await addDepartment({ name: newDepartment.name.trim(), description: newDepartment.description.trim() }).unwrap();
                toast({ title: "Department Added", description: `"${newDepartment.name.trim()}" has been added.` });
                setNewDepartment({ name: "", description: "" });
            } catch (error) {
                toast({ title: "Error", description: "Failed to add department.", variant: "destructive" });
            }
        }
    };

    const handleRemoveDepartment = async (department: { _id: string, name: string }) => {
        try {
            await deleteDepartment(department._id).unwrap();
            toast({ title: "Department Removed", description: `"${department.name}" has been removed.` });
        } catch (error) {
            toast({ title: "Error", description: "Failed to remove department.", variant: "destructive" });
        }
    };

    const handleAddDesignation = async () => {
        if (newDesignation.name.trim()) {
            try {
                await addDesignation({ name: newDesignation.name.trim(), description: newDesignation.description.trim() }).unwrap();
                toast({ title: "Designation Added", description: `"${newDesignation.name.trim()}" has been added.` });
                setNewDesignation({ name: "", description: "" });
            } catch (error) {
                toast({ title: "Error", description: "Failed to add designation.", variant: "destructive" });
            }
        }
    };

    const handleRemoveDesignation = async (designation: { _id: string, name: string }) => {
        try {
            await deleteDesignation(designation._id).unwrap();
            toast({ title: "Designation Removed", description: `"${designation.name}" has been removed.` });
        } catch (error) {
            toast({ title: "Error", description: "Failed to remove designation.", variant: "destructive" });
        }
    };
    
    const handleAddAnnouncementCategory = async () => {
        if (newAnnouncementCategory.name.trim()) {
            try {
                await addAnnouncementCategory({ name: newAnnouncementCategory.name.trim(), description: newAnnouncementCategory.description.trim() }).unwrap();
                toast({ title: "Category Added", description: `"${newAnnouncementCategory.name.trim()}" has been added.` });
                setNewAnnouncementCategory({ name: "", description: "" });
            } catch (error) {
                toast({ title: "Error", description: "Failed to add category.", variant: "destructive" });
            }
        }
    };

    const handleRemoveAnnouncementCategory = async (category: { _id: string, name: string }) => {
        try {
            await deleteAnnouncementCategory(category._id).unwrap();
            toast({ title: "Category Removed", description: `"${category.name}" has been removed.` });
        } catch (error) {
            toast({ title: "Error", description: "Failed to remove category.", variant: "destructive" });
        }
    };


    const renderTable = (
        title: string,
        description: string,
        items: Item[],
        isLoading: boolean,
        isAdding: boolean,
        onAdd: () => void,
        onRemove: (item: any) => void,
        onEdit: (item: any) => void,
        onView: (item: any) => void,
        type: ItemType,
        newItem: { name: string, description: string },
        setNewItem: React.Dispatch<React.SetStateAction<{ name: string, description: string }>>
    ) => (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Add New Item Form */}
                <div className="flex gap-2 mb-4">
                    <Input
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder={`New ${type.replace(/([A-Z])/g, ' $1').toLowerCase()} name`}
                        disabled={isAdding}
                        className="flex-1"
                    />
                    <Input
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Description (optional)"
                        disabled={isAdding}
                        className="flex-1"
                    />
                    <Button onClick={onAdd} disabled={isAdding || !newItem.name.trim()} className="shrink-0">
                        <PlusCircle className="mr-2 h-4 w-4" /> {isAdding ? "Adding..." : "Add"}
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                    <div className="max-h-96 overflow-y-auto scrollbar-hide">
                        <Table>
                            <TableHeader className="sticky top-0 bg-background z-10 border-b">
                                <TableRow>
                                    <TableHead className="w-[30%]">Name</TableHead>
                                    <TableHead className="w-[50%]">Description</TableHead>
                                    <TableHead className="text-right w-[20%]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    [...Array(3)].map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : items.length > 0 ? (
                                    items.map((item) => (
                                        <TableRow key={item._id}>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {item.description || <span className="italic text-muted-foreground/50">No description</span>}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => onView(item)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => onRemove(item)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8">
                                            <EmptyState 
                                                title={`No ${type}s`} 
                                                description={`No ${type.replace(/([A-Z])/g, ' $1').toLowerCase()}s have been added yet.`} 
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );


    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <div className="grid md:grid-cols-2 gap-6">
                {renderTable(
                    "Manage Subjects",
                    "Add or remove subjects offered.",
                    subjects,
                    isLoadingSubjects,
                    isAddingSubject,
                    handleAddSubject,
                    handleRemoveSubject,
                    (item) => openEditDialog(item, "subject"),
                    (item) => openPreviewDialog(item, "subject"),
                    "subject",
                    newSubject,
                    setNewSubject
                )}
                {renderTable(
                    "Manage Departments",
                    "Add or remove academic departments.",
                    departments,
                    isLoadingDepartments,
                    isAddingDepartment,
                    handleAddDepartment,
                    handleRemoveDepartment,
                    (item) => openEditDialog(item, "department"),
                    (item) => openPreviewDialog(item, "department"),
                    "department",
                    newDepartment,
                    setNewDepartment
                )}
                {renderTable(
                    "Manage Designations",
                    "Add or remove teacher designations.",
                    designations,
                    isLoadingDesignations,
                    isAddingDesignation,
                    handleAddDesignation,
                    handleRemoveDesignation,
                    (item) => openEditDialog(item, "designation"),
                    (item) => openPreviewDialog(item, "designation"),
                    "designation",
                    newDesignation,
                    setNewDesignation
                )}
                {renderTable(
                    "Announcement Categories",
                    "Manage announcement categories.",
                    announcementCategories,
                    isLoadingAnnouncementCategories,
                    isAddingAnnouncementCategory,
                    handleAddAnnouncementCategory,
                    handleRemoveAnnouncementCategory,
                    (item) => openEditDialog(item, "announcementCategory"),
                    (item) => openPreviewDialog(item, "announcementCategory"),
                    "announcementCategory",
                    newAnnouncementCategory,
                    setNewAnnouncementCategory
                )}
            </div>

            <Dialog open={!!itemToEdit} onOpenChange={closeEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit {editType?.replace(/([A-Z])/g, ' $1')}</DialogTitle>
                        <DialogDescription>Update the details for this item.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Name"
                        />
                        <Textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Description (optional)"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={closeEditDialog}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isUpdatingSubject || isUpdatingDepartment || isUpdatingDesignation || isUpdatingAnnouncementCategory}>
                            {(isUpdatingSubject || isUpdatingDepartment || isUpdatingDesignation || isUpdatingAnnouncementCategory) ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ItemPreviewDialog
                open={!!itemToView}
                onOpenChange={closePreviewDialog}
                item={itemToView}
                type={viewType}
            />
        </div>
    );
}
