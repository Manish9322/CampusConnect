"use client"

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2, Edit, Eye, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetSubjectsQuery, useAddSubjectMutation, useDeleteSubjectMutation, useUpdateSubjectMutation, useGetDepartmentsQuery, useAddDepartmentMutation, useDeleteDepartmentMutation, useUpdateDepartmentMutation, useGetDesignationsQuery, useAddDesignationMutation, useDeleteDesignationMutation, useUpdateDesignationMutation, useGetAnnouncementCategoriesQuery, useAddAnnouncementCategoryMutation, useUpdateAnnouncementCategoryMutation, useDeleteAnnouncementCategoryMutation } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ItemPreviewDialog } from "@/components/admin/settings/item-preview-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

type Item = {
    _id: string;
    name: string;
    description?: string;
}

type FeeComponent = {
    id: string;
    name: string;
    category: 'Academic' | 'Administrative' | 'Ancillary' | 'Custom';
    description?: string;
    amount: number;
    isActive: boolean;
};

type ItemToModify = Item | null;
type ItemType = "subject" | "department" | "designation" | "announcementCategory";

const initialFeeComponents: FeeComponent[] = [
    { id: '1', name: 'Tuition Fees', category: 'Academic', amount: 5000, isActive: true, description: 'Core course tuition for the semester.' },
    { id: '2', name: 'Exam Fees', category: 'Academic', amount: 250, isActive: true, description: 'Fee for mid-term and final examinations.' },
    { id: '3', name: 'Library Fees', category: 'Ancillary', amount: 100, isActive: true, description: 'Annual library access and resource fee.' },
    { id: '4', name: 'Admission Fees', category: 'Administrative', amount: 500, isActive: true, description: 'One-time fee for new admissions.' },
    { id: '5', name: 'Transportation Fees', category: 'Ancillary', amount: 300, isActive: false, description: 'Optional fee for campus bus services.' },
    { id: '6', name: 'Hostel Fees', category: 'Ancillary', amount: 1200, isActive: true, description: 'Fee for on-campus housing.' },
];

export default function SettingsPage() {
    const [newSubject, setNewSubject] = React.useState({ name: "", description: "", departmentId: "", departmentName: "" });
    const [newDepartment, setNewDepartment] = React.useState({ name: "", description: "" });
    const [newDesignation, setNewDesignation] = React.useState({ name: "", description: "" });
    const [newAnnouncementCategory, setNewAnnouncementCategory] = React.useState({ name: "", description: "" });
    
    const [itemToEdit, setItemToEdit] = React.useState<ItemToModify>(null);
    const [editName, setEditName] = React.useState("");
    const [editDescription, setEditDescription] = React.useState("");
    const [editDepartmentId, setEditDepartmentId] = React.useState("");
    const [editDepartmentName, setEditDepartmentName] = React.useState("");
    const [editType, setEditType] = React.useState<ItemType | null>(null);
    
    const [itemToView, setItemToView] = React.useState<ItemToModify>(null);
    const [viewType, setViewType] = React.useState<ItemType | null>(null);

    // Fee Management State
    const [feeComponents, setFeeComponents] = React.useState<FeeComponent[]>(initialFeeComponents);
    const [isFeeDialogOpen, setFeeDialogOpen] = React.useState(false);
    const [feeToEdit, setFeeToEdit] = React.useState<FeeComponent | null>(null);
    const [newFee, setNewFee] = React.useState({ name: "", category: "Custom" as FeeComponent['category'], amount: "", description: "" });

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

    const openEditDialog = (item: any, type: ItemType) => {
        setItemToEdit(item);
        setEditName(item?.name || "");
        setEditDescription(item?.description || "");
        setEditDepartmentId(item?.departmentId || "");
        setEditDepartmentName(item?.departmentName || "");
        setEditType(type);
    };

    const closeEditDialog = () => {
        setItemToEdit(null);
        setEditName("");
        setEditDescription("");
        setEditDepartmentId("");
        setEditDepartmentName("");
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
            let updatedData: any = { _id: itemToEdit._id, name: editName, description: editDescription };
            if (editType === 'subject') {
                updatedData.departmentId = editDepartmentId;
                updatedData.departmentName = editDepartmentName;
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
                await addSubject({ 
                    name: newSubject.name.trim(), 
                    description: newSubject.description.trim(),
                    departmentId: newSubject.departmentId,
                    departmentName: newSubject.departmentName
                }).unwrap();
                toast({ title: "Subject Added", description: `"${newSubject.name.trim()}" has been added.` });
                setNewSubject({ name: "", description: "", departmentId: "", departmentName: "" });
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

    // Fee Management Handlers
    const totalActiveFees = React.useMemo(() => {
        return feeComponents.reduce((acc, fee) => (fee.isActive ? acc + fee.amount : acc), 0);
    }, [feeComponents]);

    const handleAddFee = () => {
        if (newFee.name.trim() && newFee.amount) {
            const newFeeComponent: FeeComponent = {
                id: Date.now().toString(),
                name: newFee.name.trim(),
                category: newFee.category,
                description: newFee.description.trim(),
                amount: parseFloat(newFee.amount),
                isActive: true,
            };
            setFeeComponents([...feeComponents, newFeeComponent]);
            toast({ title: "Fee Component Added", description: `"${newFeeComponent.name}" has been added.` });
            setNewFee({ name: "", category: "Custom", amount: "", description: "" });
        } else {
            toast({ title: "Validation Error", description: "Fee Name and Amount are required.", variant: "destructive" });
        }
    };

    const handleEditFee = (fee: FeeComponent) => {
        setFeeToEdit(fee);
        setFeeDialogOpen(true);
    };

    const handleSaveFee = (updatedFee: FeeComponent) => {
        setFeeComponents(feeComponents.map(f => f.id === updatedFee.id ? updatedFee : f));
        toast({ title: "Fee Component Updated", description: `"${updatedFee.name}" has been updated.` });
        setFeeDialogOpen(false);
        setFeeToEdit(null);
    };

    const handleRemoveFee = (feeId: string) => {
        setFeeComponents(feeComponents.filter(f => f.id !== feeId));
        toast({ title: "Fee Component Removed" });
    };

    const handleToggleFeeStatus = (feeId: string, isActive: boolean) => {
        setFeeComponents(feeComponents.map(f => f.id === feeId ? { ...f, isActive } : f));
    };

    const renderSubjectTable = () => (
        <Card>
            <CardHeader className="space-y-1.5">
                <CardTitle className="text-lg md:text-xl">Manage Subjects</CardTitle>
                <CardDescription className="text-sm">Add or remove subjects offered.</CardDescription>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
                {/* Add New Subject Form - Responsive */}
                <div className="flex flex-col gap-2 mb-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                            value={newSubject.name}
                            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                            placeholder="New subject name"
                            disabled={isAddingSubject}
                            className="w-full sm:flex-1"
                        />
                        <Input
                            value={newSubject.description}
                            onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                            placeholder="Description (optional)"
                            disabled={isAddingSubject}
                            className="w-full sm:flex-1"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative w-full sm:flex-1">
                            <Select
                                value={newSubject.departmentId || undefined}
                                onValueChange={(value) => {
                                    const selectedDept = departments.find((d: Item) => d._id === value);
                                    setNewSubject({
                                        ...newSubject,
                                        departmentId: value,
                                        departmentName: selectedDept?.name || ""
                                    });
                                }}
                                disabled={isAddingSubject}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select department (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((dept: Item) => (
                                        <SelectItem key={dept._id} value={dept._id}>
                                            {dept.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {newSubject.departmentId && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-8 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
                                    onClick={() => setNewSubject({ ...newSubject, departmentId: "", departmentName: "" })}
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                        <Button
                            onClick={handleAddSubject}
                            disabled={isAddingSubject || !newSubject.name.trim()}
                            className="w-full sm:w-auto shrink-0"
                        >
                            <PlusCircle className="mr-2 h-4 w-4" /> {isAddingSubject ? "Adding..." : "Add"}
                        </Button>
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block rounded-md border">
                    <div className="max-h-96 overflow-y-auto scrollbar-hide">
                        <Table>
                            <TableHeader className="sticky top-0 bg-background z-10 border-b">
                                <TableRow>
                                    <TableHead className="w-[25%]">Name</TableHead>
                                    <TableHead className="w-[25%]">Department</TableHead>
                                    <TableHead className="w-[35%]">Description</TableHead>
                                    <TableHead className="text-right w-[15%]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoadingSubjects ? (
                                    [...Array(3)].map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : subjects.length > 0 ? (
                                    subjects.map((item: any) => (
                                        <TableRow key={item._id}>
                                            <TableCell className="font-medium max-w-[200px] truncate">{item.name}</TableCell>
                                            <TableCell className="text-muted-foreground max-w-[200px] truncate">
                                                {item.departmentName || <span className="italic text-muted-foreground/50">No department</span>}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground max-w-[300px] truncate">
                                                {item.description || <span className="italic text-muted-foreground/50">No description</span>}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => openPreviewDialog(item, "subject")}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(item, "subject")}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveSubject(item)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8">
                                            <EmptyState 
                                                title="No subjects" 
                                                description="No subjects have been added yet." 
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {isLoadingSubjects ? (
                        [...Array(3)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-4 space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-9 w-full" />
                                </CardContent>
                            </Card>
                        ))
                    ) : subjects.length > 0 ? (
                        <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
                            {subjects.map((item: any) => (
                                <Card key={item._id}>
                                    <CardContent className="p-4 space-y-3">
                                        <div>
                                            <h4 className="font-semibold text-base truncate">{item.name}</h4>
                                            <p className="text-xs text-muted-foreground mt-1 truncate">
                                                Department: {item.departmentName || <span className="italic">No department</span>}
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1 truncate">
                                                {item.description || <span className="italic text-muted-foreground/50">No description</span>}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="flex-1" onClick={() => openPreviewDialog(item, "subject")}>
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(item, "subject")}>
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleRemoveSubject(item)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <EmptyState 
                                    title="No subjects" 
                                    description="No subjects have been added yet." 
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>
            </CardContent>
        </Card>
    );


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
            <CardHeader className="space-y-1.5">
                <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
                <CardDescription className="text-sm">{description}</CardDescription>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
                {/* Add New Item Form - Responsive */}
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <Input
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder={`New ${type.replace(/([A-Z])/g, ' $1').toLowerCase()} name`}
                        disabled={isAdding}
                        className="w-full sm:flex-1"
                    />
                    <Input
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Description (optional)"
                        disabled={isAdding}
                        className="w-full sm:flex-1"
                    />
                    <Button onClick={onAdd} disabled={isAdding || !newItem.name.trim()} className="w-full sm:w-auto shrink-0">
                        <PlusCircle className="mr-2 h-4 w-4" /> {isAdding ? "Adding..." : "Add"}
                    </Button>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block rounded-md border">
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
                                            <TableCell className="font-medium max-w-[200px] truncate">{item.name}</TableCell>
                                            <TableCell className="text-muted-foreground max-w-[300px] truncate">
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

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {isLoading ? (
                        [...Array(3)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-4 space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-9 w-full" />
                                </CardContent>
                            </Card>
                        ))
                    ) : items.length > 0 ? (
                        <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
                            {items.map((item) => (
                                <Card key={item._id}>
                                    <CardContent className="p-4 space-y-3">
                                        <div>
                                            <h4 className="font-semibold text-base truncate">{item.name}</h4>
                                            <p className="text-sm text-muted-foreground mt-1 truncate">
                                                {item.description || <span className="italic text-muted-foreground/50">No description</span>}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(item)}>
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(item)}>
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => onRemove(item)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <EmptyState 
                                    title={`No ${type}s`} 
                                    description={`No ${type.replace(/([A-Z])/g, ' $1').toLowerCase()}s have been added yet.`} 
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    const renderFeeManagement = () => (
        <Card>
            <CardHeader className="space-y-1.5">
                <CardTitle className="text-lg md:text-xl">Manage Fee Components</CardTitle>
                <CardDescription className="text-sm">Define and manage various fees for students.</CardDescription>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-lg bg-muted/50 mb-4">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-6 w-6 text-primary" />
                        <span className="text-sm font-medium">Total Active Fees:</span>
                    </div>
                    <span className="text-2xl font-bold">${totalActiveFees.toLocaleString()}</span>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                        <Input
                            value={newFee.name}
                            onChange={(e) => setNewFee({ ...newFee, name: e.target.value })}
                            placeholder="Fee Name (e.g., Sports Fee)"
                            className="md:col-span-1"
                        />
                        <Select
                            value={newFee.category}
                            onValueChange={(value) => setNewFee({ ...newFee, category: value as FeeComponent['category'] })}
                        >
                            <SelectTrigger className="md:col-span-1">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Academic">Academic</SelectItem>
                                <SelectItem value="Administrative">Administrative</SelectItem>
                                <SelectItem value="Ancillary">Ancillary</SelectItem>
                                <SelectItem value="Custom">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            type="number"
                            value={newFee.amount}
                            onChange={(e) => setNewFee({ ...newFee, amount: e.target.value })}
                            placeholder="Amount ($)"
                            className="md:col-span-1"
                        />
                         <Button onClick={handleAddFee} className="w-full md:col-span-1">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[30%]">Name</TableHead>
                                <TableHead className="w-[20%]">Category</TableHead>
                                <TableHead className="w-[15%] text-right">Amount</TableHead>
                                <TableHead className="w-[15%] text-center">Status</TableHead>
                                <TableHead className="text-right w-[20%]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {feeComponents.length > 0 ? (
                                feeComponents.map((fee) => (
                                    <TableRow key={fee.id}>
                                        <TableCell className="font-medium">{fee.name}</TableCell>
                                        <TableCell><Badge variant="outline">{fee.category}</Badge></TableCell>
                                        <TableCell className="text-right font-mono">${fee.amount.toLocaleString()}</TableCell>
                                        <TableCell className="text-center">
                                            <Switch
                                                checked={fee.isActive}
                                                onCheckedChange={(checked) => handleToggleFeeStatus(fee.id, checked)}
                                                aria-label={`Toggle ${fee.name} status`}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditFee(fee)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveFee(fee.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <EmptyState title="No Fee Components" description="Add fee components using the form above." />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold">Settings</h1>
            <span>Manage your account settings and personalize your overall campus connect experience.</span>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {renderFeeManagement()}
                {renderSubjectTable()}
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
                        {editType === "subject" && (
                            <div className="relative">
                                <Select
                                    value={editDepartmentId || undefined}
                                    onValueChange={(value) => {
                                        const selectedDept = departments.find((d: Item) => d._id === value);
                                        setEditDepartmentId(value);
                                        setEditDepartmentName(selectedDept?.name || "");
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select department (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((dept: Item) => (
                                            <SelectItem key={dept._id} value={dept._id}>
                                                {dept.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editDepartmentId && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-8 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
                                        onClick={() => {
                                            setEditDepartmentId("");
                                            setEditDepartmentName("");
                                        }}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={closeEditDialog}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isUpdatingSubject || isUpdatingDepartment || isUpdatingDesignation || isUpdatingAnnouncementCategory}>
                            {(isUpdatingSubject || isUpdatingDepartment || isUpdatingDesignation || isUpdatingAnnouncementCategory) ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {feeToEdit && (
                <Dialog open={isFeeDialogOpen} onOpenChange={setFeeDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Fee Component</DialogTitle>
                        </DialogHeader>
                        {/* A simplified form could go here to edit feeToEdit state, then call handleSaveFee */}
                    </DialogContent>
                </Dialog>
            )}

            <ItemPreviewDialog
                open={!!itemToView}
                onOpenChange={closePreviewDialog}
                item={itemToView}
                type={viewType}
            />
        </div>
    );
}
