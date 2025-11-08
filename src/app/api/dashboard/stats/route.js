
import { NextResponse } from 'next/server';
import _db from '../../../../lib/db';
import { Student } from '../../../../models/student.model';
import { Teacher } from '../../../../models/teacher.model';
import { Class } from '../../../../models/class.model';
import { Subject } from '../../../../models/subject.model';
import { Attendance } from '../../../../models/attendance.model';

export async function GET() {
    try {
        await _db();

        // Get current date info
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        
        const startOfThisYear = new Date(now.getFullYear(), 0, 1);
        const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
        const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31);

        // Get total counts
        const [totalStudents, totalTeachers, totalSubjects, totalClasses] = await Promise.all([
            Student.countDocuments(),
            Teacher.countDocuments(),
            Subject.countDocuments(),
            Class.countDocuments()
        ]);

        // Get students enrolled this month vs last month
        const [studentsThisMonth, studentsLastMonth] = await Promise.all([
            Student.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
            Student.countDocuments({ 
                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } 
            })
        ]);

        // Calculate student growth percentage
        const studentGrowth = studentsLastMonth > 0 
            ? ((studentsThisMonth - studentsLastMonth) / studentsLastMonth * 100).toFixed(1)
            : studentsThisMonth > 0 ? 100 : 0;

        // Get teachers this year vs last year
        const [teachersThisYear, teachersLastYear] = await Promise.all([
            Teacher.countDocuments({ createdAt: { $gte: startOfThisYear } }),
            Teacher.countDocuments({ 
                createdAt: { $gte: startOfLastYear, $lte: endOfLastYear } 
            })
        ]);

        // Calculate teacher growth
        const teacherGrowth = teachersThisYear - teachersLastYear;

        // Get attendance data for today and yesterday
        const [todayAttendance, yesterdayAttendance] = await Promise.all([
            Attendance.find({ date: { $gte: startOfToday } }),
            Attendance.find({ 
                date: { $gte: startOfYesterday, $lt: startOfToday } 
            })
        ]);

        // Calculate attendance rates
        const calculateAttendanceRate = (records) => {
            if (records.length === 0) return 0;
            const presentCount = records.filter(r => r.status === 'present').length;
            return ((presentCount / records.length) * 100).toFixed(1);
        };

        const todayRate = calculateAttendanceRate(todayAttendance);
        const yesterdayRate = calculateAttendanceRate(yesterdayAttendance);
        const attendanceChange = (todayRate - yesterdayRate).toFixed(1);

        // Get department count
        const departments = await Class.distinct('department');
        const departmentCount = departments.length;

        // Get weekly attendance trend (last 7 days)
        const weeklyAttendance = [];
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(startOfToday);
            date.setDate(date.getDate() - i);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            
            const dayAttendance = await Attendance.find({ 
                date: { $gte: date, $lt: nextDay } 
            });
            
            const rate = calculateAttendanceRate(dayAttendance);
            weeklyAttendance.push({
                day: daysOfWeek[date.getDay()],
                attendance: parseFloat(rate)
            });
        }

        // Get recent attendance records
        const recentAttendance = await Attendance.find()
            .sort({ date: -1 })
            .limit(8)
            .populate('studentId', 'name')
            .populate('classId', 'name')
            .lean();

        const recentAttendanceFormatted = recentAttendance.map(record => ({
            studentName: record.studentId?.name || 'Unknown',
            subject: record.classId?.name || 'Unknown',
            status: record.status,
            date: record.date
        }));

        // Get enrollment data (last 6 months)
        const enrollmentData = [];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
            
            const count = await Student.countDocuments({
                createdAt: { $gte: monthStart, $lte: monthEnd }
            });
            
            enrollmentData.push({
                month: monthNames[monthStart.getMonth()],
                students: count
            });
        }

        return NextResponse.json({
            stats: {
                totalStudents,
                totalTeachers,
                totalSubjects,
                totalClasses,
                departmentCount,
                studentGrowth: parseFloat(studentGrowth),
                teacherGrowth,
                attendanceRate: parseFloat(todayRate),
                attendanceChange: parseFloat(attendanceChange)
            },
            weeklyAttendance,
            recentAttendance: recentAttendanceFormatted,
            enrollmentData
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard statistics' },
            { status: 500 }
        );
    }
}
