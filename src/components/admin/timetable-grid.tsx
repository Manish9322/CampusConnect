"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Pencil, Trash2, Plus } from "lucide-react";
import { Period } from "@/lib/types";

interface TimetableGridProps {
  periods: Period[];
  onAddPeriod: (periodNumber: number) => void;
  onEditPeriod: (period: Period) => void;
  onDeletePeriod: (periodNumber: number) => void;
  maxPeriods?: number;
}

export function TimetableGrid({
  periods,
  onAddPeriod,
  onEditPeriod,
  onDeletePeriod,
  maxPeriods = 8,
}: TimetableGridProps) {
  // Sort periods by period number
  const sortedPeriods = [...periods].sort(
    (a, b) => a.periodNumber - b.periodNumber
  );

  // Determine the maximum period number to show empty slots
  const maxPeriodNumber = Math.max(
    maxPeriods,
    sortedPeriods.length > 0
      ? Math.max(...sortedPeriods.map((p) => p.periodNumber))
      : 0
  );

  // Create array of all period numbers
  const allPeriodNumbers = Array.from(
    { length: maxPeriodNumber },
    (_, i) => i + 1
  );

  return (
    <div className="space-y-4">
      {allPeriodNumbers.map((periodNumber) => {
        const period = sortedPeriods.find(
          (p) => p.periodNumber === periodNumber
        );

        if (!period) {
          // Empty slot
          return (
            <Card key={periodNumber} className="border-dashed">
              <CardContent className="p-2 px-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center font-semibold">
                    {periodNumber}
                  </div>
                  <div className="text-muted-foreground">
                    No period scheduled
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddPeriod(periodNumber)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Period
                </Button>
              </CardContent>
            </Card>
          );
        }

        // Period with data
        return (
          <Card
            key={periodNumber}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-2 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold flex-shrink-0">
                    {periodNumber}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center">
                      <h4 className="font-semibold text-md pr-4">
                        {period.subjectName}
                      </h4>
                      <div className="flex items-center">
                        <p className="text-sm text-muted-foreground pr-4">
                          {period.teacherName}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {period.startTime} - {period.endTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditPeriod(period)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeletePeriod(periodNumber)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {sortedPeriods.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No periods added yet. Click "Add Period" to create your first
              period.
            </p>
            <Button onClick={() => onAddPeriod(1)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Period
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
