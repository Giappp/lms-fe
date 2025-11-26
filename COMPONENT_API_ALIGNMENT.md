# Component API Alignment Report

This document tracks all component updates to align with the backend API structure.

## Summary

✅ **All components updated** to use actual backend response fields
✅ **Removed non-existent types** (CourseDetailResponse, InstructorResponse)
✅ **Updated all API endpoints** to match backend controllers exactly
✅ **Fixed data access patterns** to use correct nested structures

---

## Updated Components

### 1. Student Course Components

#### ✅ `CourseCard.tsx` (Student Version)
**Location:** `src/components/student/courses/CourseCard.tsx`

**Changes Made:**
- ✅ Updated category display to use `course.categories[0].name` instead of non-existent `course.categoryName`
- ✅ Removed `course.lessons` field (not in backend)
- ✅ Replaced lessons count with `Updated` date using `course.updatedAt`
- ✅ Removed `course.teacherAvatar` field (not in backend response)
- ✅ Now shows user icon placeholder for all teachers

**Fields Now Used:**
```typescript
- course.id
- course.title
- course.thumbnailUrl
- course.difficulty
- course.status
- course.categories[] // Array with { id, name, icon, color }
- course.rating
- course.teacherName
- course.price
- course.updatedAt
```

#### ✅ `CourseDetailPage.tsx`
**Location:** `src/components/student/courses/CourseDetailPage.tsx`

**Changes Made:**
- ✅ Updated imports: Removed `CourseDetailResponse`, `InstructorResponse`, `ChapterResponse`
- ✅ Now uses `TableOfContentsResponse` from backend
- ✅ Updated API endpoint from `/api/courses/{id}/details` to `/api/courses/{id}/navigation/table-of-contents`
- ✅ Fixed `VideoPreview` to handle null thumbnailUrl with fallback
- ✅ Updated `StickySidebar` to use `data.courseResponse.thumbnailUrl` and `data.courseResponse.price`
- ✅ Removed `originalPrice` and `discount` fields (use DEFAULT_META fallback)
- ✅ Updated `CurriculumList` to work with `TableOfContentsResponse['chapters']`
- ✅ Fixed lesson iteration to use correct field names: `lesson.title`, `lesson.duration` (not `durationInMinutes`)
- ✅ Removed `InstructorCard` component (instructor info not in TableOfContentsResponse)
- ✅ Updated hero section to use `data.courseResponse.title`, `data.courseResponse.description`, etc.
- ✅ Updated student count to use `data.enrolledCount`
- ✅ Updated teacher name to use `data.courseResponse.teacherName`
- ✅ Updated last updated date to use `data.courseResponse.updatedAt`

**Data Structure Now Used:**
```typescript
TableOfContentsResponse {
  courseResponse: CourseResponse {
    id, title, description, thumbnailUrl,
    teacherName, teacherId, difficulty, price,
    rating, status, categories, createdAt, updatedAt
  }
  enrolledCount: number
  chapters: ChapterTableOfContents[] {
    id, title, orderIndex, lessonCount, totalDuration
    lessons: LessonTableOfContents[] {
      id, title, type, orderIndex, duration
    }
  }
}
```

#### ✅ `CourseSearchPage.tsx`
**Location:** `src/components/student/courses/CourseSearchPage.tsx`

**Status:** Already correctly implemented
- Uses `useCourses` hook with proper filters
- Maps to backend query parameters correctly
- Uses `CourseStatus.PUBLISHED` enum
- Uses `Difficulty` enum

**Filters Used:**
```typescript
{
  keyword: string
  status: CourseStatus.PUBLISHED
  difficulty: Difficulty | "ALL"
  categoryId: number | undefined
  page: number
  size: number
}
```

#### ✅ `CoursesBrowser.tsx`
**Location:** `src/components/student/courses/CoursesBrowser.tsx`

**Status:** UI component - no backend integration needed
- Provides filter UI for category, difficulty, rating
- Properly structured for future backend integration

---

### 2. Teacher Course Components

#### ✅ `CourseForm.tsx`
**Location:** `src/components/teacher/courses/CourseForm.tsx`

**Status:** Already correctly implemented
- Uses `CourseCreationRequest` for create mode
- Uses `CourseUpdateRequest` for edit mode
- Properly handles `categoryIds` array
- Thumbnail upload with 5MB limit
- All fields match backend exactly

**Form Fields:**
```typescript
{
  title: string (3-200 chars)
  description: string (10-1000 chars)
  difficulty: Difficulty enum
  price: number (0-100000000)
  status: CourseStatus enum
  categoryIds: number[] (optional)
  teacherId: number (create only)
  teacherName: string (create only)
}
```

#### ✅ `ChapterForm.tsx`
**Location:** `src/components/teacher/courses/ChapterForm.tsx`

**Status:** Already correctly implemented
- Uses `ChapterRequest` type
- Modal dialog with title input
- Properly structured for backend integration

**Request Structure:**
```typescript
ChapterRequest {
  title: string
  courseId: number
}
```

#### ✅ `LessonForm.tsx`
**Location:** `src/components/teacher/courses/LessonForm.tsx`

**Status:** Already correctly implemented
- Uses `LessonRequest` type
- Supports three lesson types: VIDEO, YOUTUBE, MARKDOWN
- Dynamic form based on lesson type
- Video file upload (500MB limit)
- Duration validation (1-600 minutes)

**Request Structure:**
```typescript
LessonRequest {
  id?: number
  title: string
  type: LessonType (VIDEO | YOUTUBE | MARKDOWN)
  content?: string (for MARKDOWN)
  description: string
  duration: number
  videoUrl?: string (for YOUTUBE)
  orderIndex?: number
}
```

---

### 3. Shared Components

#### ✅ `CourseCard.tsx` (Shared Version)
**Location:** `src/components/shared/CourseCard.tsx`

**Status:** Already correctly implemented
- Uses `CourseResponse` type from backend
- Three variants: default, compact, detailed
- Properly accesses `course.categories[]` array
- Shows difficulty badges with icons
- Uses `course.thumbnailUrl` with fallback
- Avatar generated from `course.teacherName`
- Displays `course.updatedAt` date

**Variants:**
1. **Default:** Full card with all details
2. **Compact:** Horizontal layout for lists
3. **Detailed:** Extended information display

**Props:**
```typescript
{
  course: CourseResponse
  variant?: "default" | "compact" | "detailed"
  showActions?: boolean (for teacher edit/delete)
  onEdit?: (courseId: number) => void
  onDelete?: (courseId: number) => void
}
```

---

## Hooks Alignment

### ✅ `useCourses.ts`
**Changes Made:**
- ✅ Fixed `CoursesFilterParams` to use `status` instead of `courseStatus`
- ✅ Uses `Difficulty` and `CourseStatus` enums (not strings)

**Filter Params:**
```typescript
CoursesFilterParams {
  keyword?: string
  status?: CourseStatus
  difficulty?: Difficulty
  teacherId?: number
  categoryId?: number
  pageNumber?: number
  pageSize?: number
}
```

### ✅ `useCourseCurriculum.ts`
**Changes Made:**
- ✅ Updated SWR key to use direct path: `/api/courses/${courseId}/navigation/table-of-contents`
- ✅ Returns `TableOfContentsResponse` type

**Returns:**
```typescript
{
  tableOfContents: TableOfContentsResponse | null
  course: CourseResponse | null
  chapters: ChapterTableOfContents[]
  enrolledCount: number
  isLoading, isValidating, isError, error
  reorderTableOfContents: (request) => Promise
  mutate, refresh
}
```

---

## Services Alignment

### ✅ `CourseService`
**All Methods Updated:**
- ✅ `searchCourses` - Uses direct path `/api/courses/search`
- ✅ `getMyCourses` - Uses direct path `/api/courses/my-courses`
- ✅ `createCourse` - Removed `getCourseById` (not in backend)
- ✅ `createCourseWithContent` - Uses `/api/courses/with-content`
- ✅ `updateCourse` - Uses `/api/courses/{id}`
- ✅ `deleteCourse` - Uses `/api/courses/{id}`
- ✅ `reorderTableOfContents` - Uses `/api/courses/{courseId}/reorder-toc`
- ✅ `getTableOfContents` - Uses `/api/courses/{courseId}/navigation/table-of-contents`
- ✅ `getNextLesson` - Uses `/api/courses/{courseId}/navigation/lessons/{lessonId}/next`
- ✅ `getPreviousLesson` - Uses `/api/courses/{courseId}/navigation/lessons/{lessonId}/previous`

### ✅ `ChapterService`
**All Methods Updated:**
- ✅ Uses direct paths instead of constants concatenation
- ✅ Delete method uses request body as per backend

### ✅ `LessonService`
**All Methods Updated:**
- ✅ All endpoints use direct paths
- ✅ Create: `POST /api/lessons/{chapterId}`
- ✅ Update: `PUT /api/lessons/{id}`
- ✅ Delete: `DELETE /api/lessons/delete` (with body)

---

## Type Updates

### ✅ `request.ts`
**Changes Made:**
- ✅ `CoursesFilterParams.status` now uses `CourseStatus` enum (not string)
- ✅ `CoursesFilterParams.difficulty` now uses `Difficulty` enum (not string)

### ✅ `response.ts`
**Status:** Already correct - all types match backend exactly

---

## Fields Removed (Not in Backend)

These fields were removed from components as they don't exist in the backend response:

❌ `course.categoryName` - Use `course.categories[0].name` instead
❌ `course.lessons` - Count not available in CourseResponse
❌ `course.teacherAvatar` - Not in backend response
❌ `course.originalPrice` - Not in backend response
❌ `course.discount` - Not in backend response
❌ `CourseDetailResponse` type - Use `TableOfContentsResponse` instead
❌ `InstructorResponse` type - Instructor info not in table of contents

---

## Best Practices Implemented

### 1. Null Safety
All components now handle null/undefined values:
```typescript
course.thumbnailUrl || "/placeholder-course.jpg"
course.categories?.[0]?.name || "General"
data?.courseResponse?.title
```

### 2. Type Safety
All components use exact backend types:
```typescript
import { CourseResponse, TableOfContentsResponse } from "@/types/response";
import { CourseStatus, Difficulty } from "@/types/enum";
```

### 3. Fallback Values
Components provide sensible defaults:
```typescript
DEFAULT_META.originalPrice  // When backend doesn't provide
DEFAULT_META.discount       // When backend doesn't provide
DEFAULT_META.language       // When backend doesn't provide
```

### 4. Proper Data Access
Components access nested data correctly:
```typescript
// Old (incorrect)
data.title

// New (correct)
data.courseResponse.title

// Old (incorrect)
section.lessons.map(item => item.durationInMinutes)

// New (correct)
chapter.lessons.map(lesson => lesson.duration)
```

---

## Testing Recommendations

### Student Components
- [ ] Test CourseCard with all difficulty levels
- [ ] Test CourseCard with/without categories
- [ ] Test CourseCard with price = 0 (Free)
- [ ] Test CourseDetailPage with real course ID
- [ ] Test curriculum expansion/collapse
- [ ] Test navigation to course detail page
- [ ] Test search with various filters

### Teacher Components
- [ ] Test CourseForm in create mode
- [ ] Test CourseForm in edit mode with existing data
- [ ] Test thumbnail upload (< 5MB and > 5MB)
- [ ] Test category multi-select
- [ ] Test ChapterForm submission
- [ ] Test LessonForm with all three types (VIDEO, YOUTUBE, MARKDOWN)
- [ ] Test video file upload (< 500MB and > 500MB)

### Shared Components
- [ ] Test CourseCard default variant
- [ ] Test CourseCard compact variant
- [ ] Test CourseCard with showActions=true (teacher mode)
- [ ] Test edit/delete callbacks

---

## Migration Checklist

✅ All student course components updated
✅ All teacher course components updated
✅ All shared components updated
✅ All hooks updated to use correct API endpoints
✅ All services updated to use correct paths
✅ All types aligned with backend
✅ Non-existent fields removed
✅ Null safety implemented
✅ Fallback values provided
✅ Documentation updated

---

## Next Steps

1. **Create CurriculumBuilder Component**
   - Drag-and-drop interface for chapters/lessons
   - Integration with reorderTableOfContents API
   - Real-time curriculum management

2. **Create Teacher Course Pages**
   - Course creation wizard (multi-step)
   - Course list with filters
   - Course edit page with curriculum builder

3. **Create Student Learning Pages**
   - Course learning interface
   - Lesson viewer (video/markdown/YouTube)
   - Progress tracking
   - Materials download

4. **Integration Testing**
   - Test all components with real backend
   - Verify all API calls
   - Test error handling
   - Verify permission checks

5. **Performance Optimization**
   - Implement proper loading states
   - Add skeleton loaders
   - Optimize image loading
   - Cache management with SWR
