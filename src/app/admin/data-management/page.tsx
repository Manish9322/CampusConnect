"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, XCircle, Database } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminDataManagementPage() {
  const [isSeeding, setIsSeeding] = React.useState(false);
  const [isClearing, setIsClearing] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  const { toast } = useToast();

  const handleSeedSubmissions = async () => {
    setIsSeeding(true);
    setResult(null);
    try {
      const response = await fetch('/api/grades/seed', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        toast({
          title: "Submissions Seeded Successfully",
          description: `Created ${data.created} sample submissions.`,
        });
      } else {
        toast({
          title: "Seeding Failed",
          description: data.message || "An error occurred while seeding submissions.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Seeding Failed",
        description: "An error occurred while seeding submissions.",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearSubmissions = async () => {
    if (!confirm('Are you sure you want to clear ALL submissions? This action cannot be undone.')) {
      return;
    }
    
    setIsClearing(true);
    setResult(null);
    try {
      const response = await fetch('/api/grades/seed', {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Submissions Cleared",
          description: `Deleted ${data.deletedCount} submissions.`,
        });
      } else {
        toast({
          title: "Clear Failed",
          description: data.message || "An error occurred while clearing submissions.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Clear Failed",
        description: "An error occurred while clearing submissions.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Data Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage test data and database operations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Grade Submissions Seeder
          </CardTitle>
          <CardDescription>
            Generate sample submission data for testing the gradebook functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              This will create sample submissions for 60-80% of students for each assignment.
              About 70% of submissions will be pre-graded with random marks.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button 
              onClick={handleSeedSubmissions} 
              disabled={isSeeding || isClearing}
              className="flex-1"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Seed Sample Submissions
                </>
              )}
            </Button>

            <Button 
              onClick={handleClearSubmissions} 
              disabled={isSeeding || isClearing}
              variant="destructive"
              className="flex-1"
            >
              {isClearing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Clearing...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Clear All Submissions
                </>
              )}
            </Button>
          </div>

          {result && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm">Seeding Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  <strong>Total Created:</strong> {result.created}
                </p>
                {result.errors && result.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    <strong>Errors:</strong> {result.errors.length}
                  </p>
                )}
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1">Student</th>
                        <th className="text-left py-1">Assignment</th>
                        <th className="text-center py-1">Status</th>
                        <th className="text-center py-1">Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.details?.slice(0, 20).map((detail: any, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="py-1">{detail.student}</td>
                          <td className="py-1">{detail.assignment}</td>
                          <td className="text-center py-1">{detail.status}</td>
                          <td className="text-center py-1">{detail.marks ?? '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.details?.length > 20 && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      ... and {result.details.length - 20} more
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
