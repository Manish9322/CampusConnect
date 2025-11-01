# Attendance System Documentation

## Overview
The CampusConnect attendance system tracks student attendance on a daily basis and automatically calculates attendance percentages based on the current month's records.

## How It Works

### 1. **Recording Attendance**
Teachers can record attendance through the **Teacher > Attendance** page:
- Select a class from the dropdown
- Choose a date (up to 6 days in the past)
- Mark each student as: **Present**, **Absent**, or **Late**
- Submit attendance for the entire class

**Key Features:**
- Attendance is locked after 6 days (cannot modify old records)
- Attendance for a specific date can only be recorded once
- Teachers can mark all students at once using bulk actions
- Real-time validation prevents duplicate entries

### 2. **Attendance Calculation Logic**

#### Current Month Calculation
The system calculates attendance percentage based on **the current month only**:

```
Attendance % = (Present Days + Late Days) / Total Days Recorded × 100
```

**Example:**
- Month: November 2025
- Total days with attendance records: 20 days
- Present: 15 days
- Late: 3 days  
- Absent: 2 days
- **Attendance Percentage: (15 + 3) / 20 × 100 = 90%**

#### Important Notes:
- Only days with recorded attendance count toward the total
- If no attendance is recorded, percentage shows as 0%
- Late attendance counts as attended (teacher's discretion)
- Percentage resets at the start of each new month

### 3. **Viewing Attendance Data**

#### For Teachers:
**Students Page** (Teacher > Students):
- View all students across your classes
- See real-time attendance percentage for each student
- Statistics cards show:
  - Total students
  - Average class attendance
  - Top performer (highest attendance)
  - Students with low attendance (<75%)

**Attendance Page** (Teacher > Attendance):
- Record daily attendance
- View current attendance percentages while marking
- Filter by class

#### For Students:
**Attendance Page** (Student > Attendance):
- View personal attendance records
- See monthly percentage
- Track attendance history
- View detailed breakdown (Present/Late/Absent days)

### 4. **API Endpoints**

#### GET `/api/students`
Fetches students with calculated attendance percentages.

**Query Parameters:**
- `classId` (optional): Filter by class
- `includeAttendance` (optional, default: true): Calculate attendance percentages

**Response:**
```json
[
  {
    "_id": "student123",
    "name": "John Doe",
    "rollNo": "CS-001",
    "classId": "class456",
    "attendancePercentage": 85,
    ...
  }
]
```

#### GET `/api/students/attendance-stats`
Get detailed attendance statistics for a specific student.

**Query Parameters:**
- `studentId` (required): Student ID
- `month` (optional): Month (1-12, default: current month)
- `year` (optional): Year (default: current year)

**Response:**
```json
{
  "studentId": "student123",
  "month": 11,
  "year": 2025,
  "statistics": {
    "totalDays": 20,
    "presentDays": 15,
    "lateDays": 3,
    "absentDays": 2,
    "attendedDays": 18,
    "percentage": 90
  },
  "records": [...]
}
```

#### POST `/api/attendance`
Record attendance for multiple students at once.

**Request Body:**
```json
[
  {
    "studentId": "student123",
    "classId": "class456",
    "date": "2025-11-01",
    "status": "present",
    "recordedBy": "teacher789"
  }
]
```

#### GET `/api/attendance`
Fetch attendance records.

**Query Parameters:**
- `classId` (optional): Filter by class
- `date` (optional): Filter by date (YYYY-MM-DD)

### 5. **Database Schema**

#### Attendance Model
```javascript
{
  studentId: String (ref: Student),
  classId: String (ref: Class),
  date: String (YYYY-MM-DD),
  status: Enum ['present', 'absent', 'late'],
  recordedBy: String (ref: Teacher),
  timestamps: true
}
```

**Unique Index:** `(studentId, classId, date)` - Prevents duplicate records

### 6. **Business Rules**

1. **Attendance Window**: Can only record/modify attendance for the current day or up to 6 days in the past
2. **Status Values**:
   - `present`: Full attendance credit
   - `late`: Full attendance credit (teacher's discretion)
   - `absent`: No attendance credit
3. **Monthly Reset**: Percentages are calculated fresh each month
4. **Minimum Attendance**: System highlights students below 75% attendance
5. **Data Integrity**: One attendance record per student per day per class

### 7. **Features & Benefits**

✅ **Automated Calculations**: No manual percentage calculations needed
✅ **Real-time Updates**: Attendance percentages update immediately after submission
✅ **Historical Data**: All records are preserved for reporting
✅ **Bulk Operations**: Mark entire class attendance at once
✅ **Data Validation**: Prevents duplicate or invalid entries
✅ **Teacher-Specific**: Each teacher only sees their class data
✅ **Low Attendance Alerts**: Automatically identify at-risk students

### 8. **Future Enhancements** (Potential)

- [ ] Attendance reports (weekly/monthly/yearly)
- [ ] Export attendance data to Excel/PDF
- [ ] Email notifications for low attendance
- [ ] Attendance trends and analytics
- [ ] Historical month-by-month comparison
- [ ] Configurable attendance thresholds
- [ ] Biometric integration support
- [ ] Parent notifications for absences

## Technical Implementation

### Frontend (React/Next.js)
- RTK Query for API calls and caching
- Real-time updates with automatic refetching
- Optimistic UI updates for better UX
- Client-side validation before submission

### Backend (Node.js/MongoDB)
- Mongoose models with proper indexing
- Bulk write operations for performance
- Efficient aggregation queries
- Data validation and error handling

### Performance Optimizations
- Database indexes on frequently queried fields
- Bulk operations instead of individual inserts
- Calculated fields only when needed
- Proper caching strategies

## Support & Troubleshooting

### Common Issues:

**Issue**: Attendance percentage shows 0%
**Solution**: Ensure attendance has been recorded for the current month

**Issue**: Cannot submit attendance
**Solution**: Check if date is within allowed window (today or last 6 days)

**Issue**: Student not showing in attendance list
**Solution**: Verify student is enrolled in the selected class

**Issue**: Duplicate attendance error
**Solution**: Attendance already recorded for this date - check existing records

---

**Last Updated**: November 1, 2025
**Version**: 1.0.0
