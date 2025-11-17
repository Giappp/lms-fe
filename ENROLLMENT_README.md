# Enrollment Management System

A comprehensive enrollment management interface for both **Student** and **Teacher** roles, built with Next.js 15, React 19, TypeScript, shadcn/ui, and Tailwind CSS.

## 📋 Overview

This enrollment system allows:
- **Students** to view and manage their course enrollment requests
- **Teachers** to review, approve, or reject student enrollment requests

## 🎯 Features

### Student Features
- ✅ View all enrollment requests with status (PENDING, APPROVED, REJECTED)
- ✅ Filter enrollments by status
- ✅ Cancel pending enrollment requests
- ✅ View course details from enrollment card
- ✅ Real-time status updates with toast notifications
- ✅ Responsive grid layout with pagination
- ✅ Statistics dashboard showing enrollment counts

### Teacher Features
- ✅ View all students enrolled in specific courses
- ✅ **Priority display**: PENDING requests appear at the top
- ✅ Search students by name or email
- ✅ Filter by enrollment status
- ✅ Approve enrollment requests with one click
- ✅ Reject enrollment requests with optional reason
- ✅ Real-time updates with loading states
- ✅ Statistics dashboard with visual indicators
- ✅ Confirmation dialogs for critical actions

## 📁 File Structure

```
src/
├── api/
│   └── services/
│       ├── enrollment-service.ts          # API service layer
│       └── enrollment-mock-data.ts        # Mock data for demo
├── app/
│   └── (dashboard)/
│       ├── student/
│       │   └── enrollments/
│       │       └── page.tsx               # Student enrollment page
│       └── teacher/
│           └── enrollments/
│               └── page.tsx               # Teacher enrollment page
├── components/
│   ├── student/
│   │   └── enrollments/
│   │       └── StudentEnrollmentCard.tsx  # Student enrollment card component
│   └── teacher/
│       └── enrollments/
│           └── TeacherEnrollmentCard.tsx  # Teacher enrollment card component
├── hooks/
│   └── useEnrollments.ts                  # Custom SWR hooks
├── types/
│   ├── enum.ts                            # EnrollmentStatus enum
│   ├── request.ts                         # Request types
│   └── response.ts                        # Response types
└── constants/
    └── index.ts                           # API routes
```

## 🔧 API Integration

### Endpoints Used

#### Student APIs
```typescript
// Get student enrollments
GET /api/enrollments/student?status={status}&pageNumber={page}&pageSize={size}

// Cancel enrollment
DELETE /api/enrollments/{enrollmentId}
```

#### Teacher APIs
```typescript
// Get course enrollments
GET /api/enrollments/course/{courseId}?status={status}&search={search}&page={page}&size={size}

// Update enrollment status (Approve/Reject)
PUT /api/enrollments/{enrollmentId}/status
Body: { status: "APPROVED" | "REJECTED", reason?: string }
```

## 🎨 Component Architecture

### StudentEnrollmentCard
**Props:**
- `enrollment`: EnrollmentPreviewResponse
- `onCancel?`: (enrollmentId: number) => void
- `onViewCourse?`: (courseId: number) => void
- `isCanceling?`: boolean

**Features:**
- Color-coded status badges
- Course information display
- Teacher name and difficulty level
- Relative time display (e.g., "requested 2 days ago")
- Conditional action buttons based on status

### TeacherEnrollmentCard
**Props:**
- `enrollment`: EnrollmentResponse
- `onApprove?`: (enrollmentId: number) => void
- `onReject?`: (enrollmentId: number, reason?: string) => void
- `isUpdating?`: boolean

**Features:**
- Student avatar with initials fallback
- Email and name display
- **Visual priority indicator**: Yellow left border for PENDING status
- Approve/Reject buttons for pending requests
- Confirmation dialog for rejection with optional reason
- Status indicators for approved/rejected requests

## 🎭 Mock Data

Located in `src/api/services/enrollment-mock-data.ts`:

### Mock Courses (5)
- React Fundamentals
- Advanced TypeScript
- Node.js Backend Development
- Database Design
- Web Security

### Mock Students (8)
Complete user profiles with avatars, emails, and names

### Sample Enrollments
- **Student View**: 6 enrollments across different courses and statuses
- **Teacher View**: 8 enrollments for React Fundamentals course

## 🚀 Usage

### Student Page
```typescript
// Access at: /student/enrollments
import StudentEnrollmentsPage from "@/app/(dashboard)/student/enrollments/page"

// Hook usage
const { enrollments, isLoading, cancelEnrollment } = useMyEnrollments(
  status,      // Filter by status (optional)
  pageNumber,  // Page number (default: 1)
  pageSize     // Page size (default: 12)
);
```

### Teacher Page
```typescript
// Access at: /teacher/enrollments
import TeacherEnrollmentsPage from "@/app/(dashboard)/teacher/enrollments/page"

// Hook usage
const { 
  enrollments, 
  isLoading, 
  isUpdating, 
  updateEnrollmentStatus 
} = useCourseEnrollments(
  courseId,    // Required course ID
  status,      // Filter by status (optional)
  search,      // Search term (optional)
  page,        // Page number (default: 1)
  size         // Page size (default: 10)
);
```

## 🎨 UI/UX Highlights

### Responsive Design
- **Mobile**: Single column layout
- **Tablet**: 2-column grid
- **Desktop**: 3-column grid (student) / list view (teacher)

### Color Coding
- 🟡 **PENDING**: Yellow badges and borders
- 🟢 **APPROVED**: Green indicators
- 🔴 **REJECTED**: Red indicators

### User Feedback
- Toast notifications for all actions
- Loading skeletons during data fetch
- Disabled states during updates
- Confirmation dialogs for destructive actions

### Accessibility
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly

## 🔄 State Management

Uses **SWR** for efficient data fetching:
- Automatic revalidation
- Optimistic UI updates
- Error handling
- Loading states

## 📊 Statistics Dashboard

Both student and teacher pages include statistics cards:
- Total enrollments/students
- Pending count
- Approved count
- Rejected count

## 🛠️ Customization

### Pagination
Adjust page size in respective page components:
```typescript
const PAGE_SIZE = 12; // Student page
const PAGE_SIZE = 10; // Teacher page
```

### Mock Data
Replace mock data in `enrollment-mock-data.ts` with real API responses when backend is ready.

### Styling
All components use Tailwind CSS and theme variables from `theme.css`. Customize colors and spacing as needed.

## 🧪 Testing

### With Mock Data
1. Navigate to `/student/enrollments` or `/teacher/enrollments`
2. Test filtering by status
3. Test search functionality (teacher page)
4. Test approve/reject actions (teacher page)
5. Test cancel enrollment (student page)

### With Real API
Update `swrFetcher` configuration in `src/lib/swrFetcher.ts` to use real backend endpoints.

## 📦 Dependencies

All required components from shadcn/ui:
- ✅ Card
- ✅ Button
- ✅ Input
- ✅ Label
- ✅ Select
- ✅ Badge
- ✅ Avatar
- ✅ Textarea
- ✅ Alert
- ✅ AlertDialog
- ✅ Pagination
- ✅ Skeleton

## 🎯 Future Enhancements

- [ ] Bulk approve/reject functionality
- [ ] Export enrollment data
- [ ] Email notifications
- [ ] Enrollment analytics charts
- [ ] Advanced filtering (date range, course categories)
- [ ] Student profile quick view
- [ ] Course capacity management

## 📝 Notes

- **PENDING enrollments are prioritized** in teacher view (shown at top)
- All timestamps use `formatDistanceToNow` from date-fns
- Components are fully reusable and type-safe
- Follows project patterns from `.github/copilot-instructions.md`
- Uses Constants for all API routes
- Implements proper error handling and loading states

## 🔗 Navigation

- Student enrollments added to Student Sidebar under "Enrollment" section
- Teacher enrollments accessible via "Students" > "Enrollments" in Teacher Sidebar

---

**Built with ❤️ using Next.js 15, React 19, TypeScript, shadcn/ui, and Tailwind CSS**
