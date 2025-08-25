import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Percent, BarChart, ArrowUp, ArrowDown, Activity, BookOpen, UserPlus, FileText } from "lucide-react";
import { AttendanceChart } from "@/components/admin/attendance-chart";
import { EnrollmentChart } from "@/components/admin/enrollment-chart";
import { RecentAttendance } from "@/components/admin/recent-attendance";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">1,254</div>
                <p className="text-xs text-muted-foreground flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1 text-green-500"/>
                    +20.1% from last month
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">82</div>
                 <p className="text-xs text-muted-foreground flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1 text-green-500"/>
                    +5 from last year
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate (Today)</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">92.3%</div>
                <p className="text-xs text-muted-foreground flex items-center">
                    <ArrowDown className="h-3 w-3 mr-1 text-red-500"/>
                    -1.2% from yesterday
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Courses Offered</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">120</div>
                  <p className="text-xs text-muted-foreground">
                    Across 15 departments
                </p>
            </CardContent>
        </Card>
    </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AttendanceChart />
        <EnrollmentChart />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Avg. Class Size</CardTitle>
          </CardHeader>
          <CardContent className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold">28</h3>
            <span className="text-sm text-muted-foreground">students</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Teacher:Student Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-3xl font-bold">1:15</h3>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-3xl font-bold">+42</h3>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Courses in Session</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-3xl font-bold">78</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentAttendance />
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-6">
            <Card className="col-span-1 row-span-1 flex flex-col justify-center items-center">
              <CardHeader className="p-2">
                <CardTitle className="text-sm font-medium text-center">Active Alerts</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex justify-center items-center p-2">
                <div className="text-4xl font-bold">3</div>
              </CardContent>
            </Card>
            <Card className="col-span-1 row-span-2 flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Department Headcount</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 text-sm">
                <div className="flex justify-between"><span>CS</span><Badge variant="secondary">45</Badge></div>
                <div className="flex justify-between mt-1"><span>Physics</span><Badge variant="secondary">22</Badge></div>
                <div className="flex justify-between mt-1"><span>Math</span><Badge variant="secondary">15</Badge></div>
              </CardContent>
            </Card>
             <Card className="col-span-1 row-span-1 flex flex-col justify-center items-center">
              <CardHeader className="p-2">
                <CardTitle className="text-sm font-medium text-center">Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex justify-center items-center p-2">
                <div className="text-4xl font-bold">8</div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
