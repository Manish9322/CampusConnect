"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Teacher, TeacherStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"

interface TeacherColumnsProps {
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
}

export const getColumns = ({ onEdit, onDelete }: TeacherColumnsProps): ColumnDef<Teacher>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "teacherId",
    header: "Teacher ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => <Badge variant="outline">{row.original.department}</Badge>
  },
  {
    accessorKey: "courses",
    header: "Courses",
    cell: ({ row }) => (
      <div className="flex gap-1 flex-wrap">
        {row.original.courses.map((course) => (
          <Badge key={course} variant="secondary">
            {course}
          </Badge>
        ))}
      </div>
    ),
  },
   {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.status === 'active';
      return (
        <div className="flex items-center gap-2">
            <Switch
                id={`status-${row.original.id}`}
                checked={isActive}
                // In a real app, you would have an onCheckedChange handler to update the status
                onCheckedChange={() => {}} 
            />
            <span className={isActive ? 'text-green-600' : 'text-red-600'}>
                {row.original.status}
            </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const teacher = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(teacher)}>
              <Eye className="mr-2 h-4 w-4" /> View / Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(teacher)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
