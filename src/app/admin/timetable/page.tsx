"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetClassesQuery, useGetTimetableQuery, useAddTimetableMutation, useUpdateTimetableMutation, useGetPeriodsPerDayQuery, useUpdatePeriodsPerDayMutation } from '@/services/api';
import { TimetableGrid } from '@/components/admin/timetable-grid';
import { AddPeriodDialog } from '@/components/admin/add-period-dialog';
import { DayOfWeek, Period, Timetable } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TimetablePage() {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | undefined>();
  const [periodNumber, setPeriodNumber] = useState(1);
  const [currentTimetable, setCurrentTimetable] = useState<Timetable | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [periodsPerDay, setPeriodsPerDay] = useState<Record<DayOfWeek, number>>({
    Monday: 8,
    Tuesday: 8,
    Wednesday: 8,
    Thursday: 8,
    Friday: 8,
    Saturday: 8,
  });

  const { data: classes = [] } = useGetClassesQuery({});
  const { data: timetables = [], refetch: refetchTimetable } = useGetTimetableQuery(
    { classId: selectedClass },
    { skip: !selectedClass }
  );
  const { data: periodsPerDayFromAPI, isLoading: isLoadingSettings } = useGetPeriodsPerDayQuery(
    { classId: selectedClass },
    { skip: !selectedClass }
  );

  const [addTimetable, { isLoading: isAdding }] = useAddTimetableMutation();
  const [updateTimetable, { isLoading: isUpdating }] = useUpdateTimetableMutation();
  const [updatePeriodsPerDay] = useUpdatePeriodsPerDayMutation();
  
  // Load periods per day from API when class changes
  useEffect(() => {
    if (periodsPerDayFromAPI && selectedClass) {
      setPeriodsPerDay(periodsPerDayFromAPI);
    }
  }, [periodsPerDayFromAPI, selectedClass]);
  
  // Save periods per day via API
  const handlePeriodsPerDayChange = async (day: DayOfWeek, value: string) => {
    if (!selectedClass) {
      toast({
        title: "Error",
        description: "Please select a class first.",
        variant: "destructive",
      });
      return;
    }

    const num = parseInt(value, 10);
    if (num >= 1 && num <= 15) {
      const updatedSettings = { ...periodsPerDay, [day]: num };
      setPeriodsPerDay(updatedSettings);
      
      try {
        await updatePeriodsPerDay({ 
          periodsPerDay: updatedSettings, 
          classId: selectedClass 
        }).unwrap();
        toast({
          title: "Settings Updated",
          description: `${day}: ${num} ${num === 1 ? 'period' : 'periods'} per day.`,
        });
      } catch (error) {
        console.error('Error updating periods per day:', error);
        toast({
          title: "Error",
          description: "Failed to update settings. Please try again.",
          variant: "destructive",
        });
        // Revert the local state on error
        setPeriodsPerDay(periodsPerDay);
      }
    }
  };

  // Update current timetable when day or timetables change
  useEffect(() => {
    if (selectedClass && timetables.length > 0) {
      const dayTimetable = timetables.find((tt: Timetable) => tt.day === selectedDay);
      setCurrentTimetable(dayTimetable || null);
      setHasUnsavedChanges(false);
    } else {
      setCurrentTimetable(null);
      setHasUnsavedChanges(false);
    }
  }, [selectedClass, selectedDay, timetables]);

  const handleAddPeriod = (pNumber: number) => {
    setPeriodNumber(pNumber);
    setEditingPeriod(undefined);
    setIsDialogOpen(true);
  };

  const handleEditPeriod = (period: Period) => {
    setPeriodNumber(period.periodNumber);
    setEditingPeriod(period);
    setIsDialogOpen(true);
  };

  const handleDeletePeriod = (periodNumber: number) => {
    if (!currentTimetable) return;

    const updatedPeriods = currentTimetable.periods.filter(p => p.periodNumber !== periodNumber);
    setCurrentTimetable({
      ...currentTimetable,
      periods: updatedPeriods
    });
    setHasUnsavedChanges(true);

    toast({
      title: "Period removed",
      description: "Don't forget to save your changes.",
    });
  };

  const handleSavePeriod = (period: Period) => {
    let updatedPeriods: Period[];

    if (currentTimetable) {
      // Update existing or add new period
      const existingIndex = currentTimetable.periods.findIndex(p => p.periodNumber === period.periodNumber);
      if (existingIndex >= 0) {
        updatedPeriods = [...currentTimetable.periods];
        updatedPeriods[existingIndex] = period;
      } else {
        updatedPeriods = [...currentTimetable.periods, period];
      }

      setCurrentTimetable({
        ...currentTimetable,
        periods: updatedPeriods
      });
    } else {
      // Create new timetable
      const selectedClassData = classes.find((c: any) => c._id === selectedClass);
      setCurrentTimetable({
        _id: '',
        classId: selectedClass,
        className: selectedClassData?.name || '',
        day: selectedDay,
        periods: [period],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    setHasUnsavedChanges(true);
    toast({
      title: editingPeriod ? "Period updated" : "Period added",
      description: "Don't forget to save your changes.",
    });
  };

  const handleSaveTimetable = async () => {
    if (!selectedClass || !currentTimetable) {
      toast({
        title: "Error",
        description: "Please select a class and add periods first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const timetableData = {
        classId: selectedClass,
        day: selectedDay,
        periods: currentTimetable.periods
      };

      if (currentTimetable._id) {
        // Update existing
        await updateTimetable({
          _id: currentTimetable._id,
          ...timetableData
        }).unwrap();
      } else {
        // Create new
        await addTimetable(timetableData).unwrap();
      }

      await refetchTimetable();
      setHasUnsavedChanges(false);

      toast({
        title: "Success",
        description: "Timetable saved successfully.",
      });
    } catch (error: any) {
      console.error('Error saving timetable:', error);
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to save timetable.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="h-8 w-8" />
          Timetable Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Create and manage class timetables for each day of the week
        </p>
      </div>

      {/* Class Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class</CardTitle>
          <CardDescription>
            Choose a class to view or edit its timetable
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls: any) => (
                <SelectItem key={cls._id} value={cls._id}>
                  {cls.name} - Year {cls.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedClass && (
        <>
          {/* Periods Per Day Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Periods Per Day - {classes.find((c: any) => c._id === selectedClass)?.name}</CardTitle>
              <CardDescription>
                Set the number of periods for each day of the week for this class
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSettings ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {DAYS.map((day) => (
                <div key={day} className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {DAYS.map((day) => (
                <div key={day} className="space-y-2">
                  <label className="text-sm font-medium">{day.slice(0, 3)}</label>
                  <Select 
                    value={(periodsPerDay[day] || 8).toString()} 
                    onValueChange={(value) => handlePeriodsPerDayChange(day, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

          {/* Save Changes Alert */}
          {hasUnsavedChanges && (
            <Card className="border-orange-500 bg-orange-50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <p className="text-sm font-medium text-orange-900">
                    You have unsaved changes
                  </p>
                </div>
                <Button
                  onClick={handleSaveTimetable}
                  disabled={isAdding || isUpdating}
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isAdding || isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Day Tabs */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Weekly Timetable</CardTitle>
                  <CardDescription>
                    Manage periods for each day of the week
                  </CardDescription>
                </div>
                {!hasUnsavedChanges && currentTimetable && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>All changes saved</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedDay} onValueChange={(value) => setSelectedDay(value as DayOfWeek)}>
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                  {DAYS.map((day) => (
                    <TabsTrigger key={day} value={day}>
                      {day.slice(0, 3)}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {DAYS.map((day) => (
                  <TabsContent key={day} value={day} className="mt-6">
                    <TimetableGrid
                      periods={currentTimetable?.periods || []}
                      onAddPeriod={handleAddPeriod}
                      onEditPeriod={handleEditPeriod}
                      onDeletePeriod={handleDeletePeriod}
                      maxPeriods={periodsPerDay[day] || 8}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}

      {!selectedClass && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">
              Select a class to configure periods and manage the timetable
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Period Dialog */}
      <AddPeriodDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingPeriod(undefined);
        }}
        onSave={handleSavePeriod}
        existingPeriod={editingPeriod}
        periodNumber={periodNumber}
      />
    </div>
  );
}
