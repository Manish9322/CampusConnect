
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCopy, Users } from "lucide-react";

export default function TeacherDashboardPage() {
    return (
        <div className="space-y-6">
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Courses Assigned</CardTitle>
                        <BookCopy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground">
                            CS101, CS303
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45</div>
                        <p className="text-xs text-muted-foreground">
                            Across all classes
                        </p>
                    </CardContent>
                </Card>
             </div>
             <div className="text-center py-10">
                <h2 className="text-2xl font-bold">Welcome, Dr. Alan Turing!</h2>
                <p className="text-muted-foreground">Use the sidebar to navigate to your classes, students, or to take attendance.</p>
            </div>
        </div>
    );
}
