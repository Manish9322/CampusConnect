
"use client"

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2, Edit, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetSubjectsQuery, useAddSubjectMutation, useDeleteSubjectMutation, useUpdateSubjectMutation, useGetDepartmentsQuery, useAddDepartmentMutation, useDeleteDepartmentMutation, useUpdateDepartmentMutation, useGetDesignationsQuery, useAddDesignationMutation, useDeleteDesignationMutation, useUpdateDesignationMutation } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ItemPreviewDialog } from "@/components/admin/settings/item-preview-dialog";

type Item = {
    _id: string;
    name: string;
    description?: string;
}

type ItemToModify = Item | null;
type ItemType = "subject" | "department" | "designation";

export default function SettingsPage() {
    const [newSubject, setNewSubject] = React.useState({ name: "", description: "" });
    const [newDepartment, setNewDepartment] = React.useState({ name: "", description: "" });
    const [newDesignation, setNewDesignation] = React.useState({ name: "", description: "" });
    
    const [itemToEdit, setItemToEdit] = React.useState<ItemToModify>(null);
    const [editName, setEditName] = React.useState("");
    const [editDescription, setEditDescription] = React.useState("");
    const [editType, setEditType] = React.useState<ItemType | null>(null);
    
    const [itemToView, setItemToView] = React.useState<ItemToModify>(null);
    const [viewType, setViewType] = React.useState<ItemType | null>(null);

    const { toast } = useToast();

    const { data: subjects = [], isLoading: isLoadingSubjects } = useGetSubjectsQuery();
    const [addSubject, { isLoading: isAddingSubject }] = useAddSubjectMutation();
    const [updateSubject, { isLoading: isUpdatingSubject }] = useUpdateSubjectMutation();
    const [deleteSubject] = useDeleteSubjectMutation();
    
    const { data: departments = [], isLoading: isLoadingDepartments } = useGetDepartmentsQuery();
    const [addDepartment, { isLoading: isAddingDepartment }] = useAddDepartmentMutation();
    const [updateDepartment, { isLoading: isUpdatingDepartment }] = useUpdateDepartmentMutation();
    const [deleteDepartment] = useDeleteDepartmentMutation();

    const { data: designations = [], isLoading: isLoadingDesignations } = useGetDesignationsQuery();
    const [addDesignation, { isLoading: isAddingDesignation }] = useAddDesignationMutation();
    const [updateDesignation, { isLoading: isUpdatingDesignation }] = useUpdateDesignationMutation();
    const [deleteDesignation] = useDeleteDesignationMutation();

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

    const renderCard = (
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
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Input
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder={`New ${type} name`}
                        disabled={isAdding}
                    />
                    <Textarea
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder={`${type.charAt(0).toUpperCase() + type.slice(1)} description (optional)`}
                        disabled={isAdding}
                        rows={2}
                    />
                    <Button onClick={onAdd} disabled={isAdding || !newItem.name.trim()}>
                        <PlusCircle className="mr-2 h-4 w-4" /> {isAdding ? "Adding..." : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                    </Button>
                </div>
                <div className="flex-1 relative">
                    <ScrollArea className="absolute inset-0 pr-6">
                        <div className="space-y-2">
                            {isLoading ? (
                                [...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
                            ) : items.length > 0 ? (
                                items.map((item) => (
                                    <div key={item._id} className="flex items-center justify-between p-2 border rounded-md">
                                        <div className="flex-1 overflow-hidden">
                                            <p className="font-medium truncate">{item.name}</p>
                                            {item.description && <p className="text-sm text-muted-foreground truncate line-clamp-1">{item.description}</p>}
                                        </div>
                                        <div>
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
                                    </div>
                                ))
                            ) : (
                                <EmptyState title={`No ${type}s`} description={`No ${type}s have been added yet.`} />
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    );


    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {renderCard(
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
                {renderCard(
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
                {renderCard(
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
            </div>

            <Dialog open={!!itemToEdit} onOpenChange={closeEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit {editType}</DialogTitle>
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
                        <Button onClick={handleSave} disabled={isUpdatingSubject || isUpdatingDepartment || isUpdatingDesignation}>
                            {(isUpdatingSubject || isUpdatingDepartment || isUpdatingDesignation) ? "Saving..." : "Save Changes"}
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
