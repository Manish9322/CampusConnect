"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetSubjectsQuery, useGetTeachersQuery } from '@/services/api';
import { Period } from '@/lib/types';

interface AddPeriodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (period: Period) => void;
  existingPeriod?: Period;
  periodNumber: number;
}

export function AddPeriodDialog({ isOpen, onClose, onSave, existingPeriod, periodNumber }: AddPeriodDialogProps) {
  const { data: subjects = [] } = useGetSubjectsQuery({});
  const { data: teachers = [] } = useGetTeachersQuery({});

  const [formData, setFormData] = useState<Period>({
    periodNumber: periodNumber,
    subjectId: '',
    subjectName: '',
    teacherId: '',
    teacherName: '',
    startTime: '',
    endTime: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [teacherSubjects, setTeacherSubjects] = useState<any[]>([]);

  useEffect(() => {
    if (existingPeriod) {
      setFormData(existingPeriod);
      // Set teacher subjects when editing
      if (existingPeriod.teacherId) {
        const teacher = teachers.find((t: any) => t._id === existingPeriod.teacherId);
        if (teacher) {
          const teacherSubjectIds = teacher.subjects || [];
          const filteredSubjects = subjects.filter((s: any) => {
            const subjectId = s._id?.toString() || s._id;
            return teacherSubjectIds.some((tsId: string) => {
              const teacherSubId = tsId?.toString() || tsId;
              return teacherSubId === subjectId;
            });
          });
          setTeacherSubjects(filteredSubjects);
        }
      }
    } else {
      setFormData({
        periodNumber: periodNumber,
        subjectId: '',
        subjectName: '',
        teacherId: '',
        teacherName: '',
        startTime: '',
        endTime: ''
      });
      setTeacherSubjects([]);
    }
  }, [existingPeriod, periodNumber, teachers, subjects]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.subjectId) {
      newErrors.subjectId = 'Subject is required';
    }

    if (!formData.teacherId) {
      newErrors.teacherId = 'Teacher is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubjectChange = (subjectId: string) => {
    const subject = subjects.find((s: any) => s._id === subjectId);
    setFormData({
      ...formData,
      subjectId,
      subjectName: subject?.name || ''
    });
    if (errors.subjectId) {
      setErrors({ ...errors, subjectId: '' });
    }
  };

  const handleTeacherChange = (teacherId: string) => {
    const teacher = teachers.find((t: any) => t._id === teacherId);
    
    if (teacher) {
      // Get subjects taught by this teacher
      const teacherSubjectIds = teacher.subjects || [];
      
      // Match subjects by comparing IDs (handle both string and ObjectId comparisons)
      const filteredSubjects = subjects.filter((s: any) => {
        const subjectId = s._id?.toString() || s._id;
        return teacherSubjectIds.some((tsId: string) => {
          const teacherSubId = tsId?.toString() || tsId;
          return teacherSubId === subjectId;
        });
      });
      
      setTeacherSubjects(filteredSubjects);
      
      // Auto-select subject if teacher teaches only one subject
      if (filteredSubjects.length === 1) {
        setFormData({
          ...formData,
          teacherId,
          teacherName: teacher.name || '',
          subjectId: filteredSubjects[0]._id,
          subjectName: filteredSubjects[0].name
        });
        if (errors.subjectId) {
          setErrors({ ...errors, subjectId: '' });
        }
      } else {
        // Multiple or no subjects - user needs to select
        setFormData({
          ...formData,
          teacherId,
          teacherName: teacher.name || '',
          subjectId: '',
          subjectName: ''
        });
      }
    }
    
    if (errors.teacherId) {
      setErrors({ ...errors, teacherId: '' });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      periodNumber: periodNumber,
      subjectId: '',
      subjectName: '',
      teacherId: '',
      teacherName: '',
      startTime: '',
      endTime: ''
    });
    setErrors({});
    setTeacherSubjects([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {existingPeriod ? 'Edit' : 'Add'} Period {periodNumber}
          </DialogTitle>
          <DialogDescription>
            {existingPeriod ? 'Update the period details' : 'Add a new period to the timetable'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teacher">Teacher *</Label>
            <Select
              value={formData.teacherId}
              onValueChange={handleTeacherChange}
            >
              <SelectTrigger className={errors.teacherId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher: any) => (
                  <SelectItem key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.teacherId && (
              <p className="text-sm text-red-500">{errors.teacherId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            {formData.teacherId && teacherSubjects.length === 1 ? (
              // Auto-selected subject - show as disabled input
              <Input
                value={formData.subjectName}
                disabled
                className="bg-muted"
              />
            ) : formData.teacherId && teacherSubjects.length > 1 ? (
              // Multiple subjects - show dropdown with teacher's subjects only
              <Select
                value={formData.subjectId}
                onValueChange={handleSubjectChange}
              >
                <SelectTrigger className={errors.subjectId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {teacherSubjects.map((subject: any) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              // No teacher selected yet - show all subjects
              <Select
                value={formData.subjectId}
                onValueChange={handleSubjectChange}
              >
                <SelectTrigger className={errors.subjectId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select teacher first" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject: any) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.subjectId && (
              <p className="text-sm text-red-500">{errors.subjectId}</p>
            )}
            {formData.teacherId && teacherSubjects.length === 0 && (
              <p className="text-sm text-amber-600">This teacher has no subjects assigned</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className={errors.startTime ? 'border-red-500' : ''}
              />
              {errors.startTime && (
                <p className="text-sm text-red-500">{errors.startTime}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className={errors.endTime ? 'border-red-500' : ''}
              />
              {errors.endTime && (
                <p className="text-sm text-red-500">{errors.endTime}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {existingPeriod ? 'Update' : 'Add'} Period
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
