# Course Module API Integration

This document describes the complete integration between the frontend and backend Course module APIs.

## ✅ Integration Status: COMPLETE

All frontend components and services are now fully aligned with the backend API structure.

## Backend Controllers Overview

### 1. CourseController (`/api/courses`)

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| `/api/courses/with-content` | POST | Create course with complete structure | `CourseWithContentRequest` + thumbnail | `TableOfContentsResponse` |
| `/api/courses` | POST | Create new course | `CourseCreationRequest` + thumbnail | `CourseResponse` |
| `/api/courses/{id}` | PUT | Update course | `CourseUpdateRequest` + thumbnail | `CourseResponse` |
| `/api/courses/{id}` | DELETE | Delete course | - | void |
| `/api/courses/search` | GET | Search courses with filters | Query params | `Page<CourseResponse>` |
| `/api/courses/my-courses` | GET | Get teacher's/student's courses | pageNumber, pageSize | `Page<CourseResponse>` |
| `/api/courses/{courseId}/reorder-toc` | PUT | Reorder chapters and lessons | `ReorderTableOfContentsRequest` | void |

**Query Parameters for Search:**
- `keyword` (String): Search keyword
- `status` (CourseStatus): PUBLISHED, DRAFT
- `difficulty` (Difficulty): BEGINNER, INTERMEDIATE, ADVANCED
- `teacherId` (Long): Filter by teacher
- `categoryId` (Long): Filter by category
- `pageNumber` (int): Page number (default: 1)
- `pageSize` (int): Page size (default: 20)

### 2. ChapterController (`/api/chapters`)

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| `/api/chapters` | POST | Create new chapter | `ChapterRequest` | `ChapterResponse` |
| `/api/chapters/{id}` | PUT | Update chapter | `ChapterRequest` | `ChapterResponse` |
| `/api/chapters/delete` | DELETE | Delete chapter | `DeleteChapterRequest` (body) | void |

### 3. LessonController (`/api/lessons`)

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| `/api/lessons/{chapterId}` | POST | Create new lesson | `LessonRequest` + videoFile | `LessonResponse` |
| `/api/lessons/{id}` | PUT | Update lesson | `LessonRequest` + videoFile | `LessonResponse` |
| `/api/lessons/delete` | DELETE | Delete lesson | `DeleteLessonRequest` (body) | void |
| `/api/lessons/{lessonId}/materials` | POST | Upload material | file | `FileResponse` |
| `/api/lessons/{lessonId}/materials` | GET | Get lesson materials | - | `List<FileResponse>` |
| `/api/lessons/{lessonId}/materials/{fileId}` | DELETE | Delete material | - | void |
| `/api/lessons/{lessonId}/materials/{fileId}/download` | GET | Download material | - | Binary (blob) |
| `/api/lessons/{lessonId}/video` | DELETE | Delete video | - | void |

### 4. CourseNavigationController (`/api/courses/{courseId}/navigation`)

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| `/api/courses/{courseId}/navigation/table-of-contents` | GET | Get course TOC | - | `TableOfContentsResponse` |
| `/api/courses/{courseId}/navigation/lessons/{lessonId}/next` | GET | Get next lesson | - | `LessonResponse` |
| `/api/courses/{courseId}/navigation/lessons/{lessonId}/previous` | GET | Get previous lesson | - | `LessonResponse` |

## Frontend Integration

### Services

All service methods use the `apiCall` wrapper for consistent error handling.

**CourseService** (`src/api/services/course-service.ts`):
- ✅ `searchCourses(options)` - Maps to GET /api/courses/search
- ✅ `getMyCourses(pageNumber, pageSize)` - Maps to GET /api/courses/my-courses
- ✅ `createCourse(request, thumbnail)` - Maps to POST /api/courses
- ✅ `createCourseWithContent(request, thumbnail)` - Maps to POST /api/courses/with-content
- ✅ `updateCourse(courseId, request, thumbnail)` - Maps to PUT /api/courses/{id}
- ✅ `deleteCourse(courseId)` - Maps to DELETE /api/courses/{id}
- ✅ `reorderTableOfContents(courseId, request)` - Maps to PUT /api/courses/{courseId}/reorder-toc
- ✅ `getTableOfContents(courseId)` - Maps to GET /api/courses/{courseId}/navigation/table-of-contents
- ✅ `getNextLesson(courseId, lessonId)` - Maps to GET /api/courses/{courseId}/navigation/lessons/{lessonId}/next
- ✅ `getPreviousLesson(courseId, lessonId)` - Maps to GET /api/courses/{courseId}/navigation/lessons/{lessonId}/previous

**ChapterService** (`src/api/services/chapter-service.ts`):
- ✅ `createChapter(request)` - Maps to POST /api/chapters
- ✅ `updateChapter(chapterId, request)` - Maps to PUT /api/chapters/{id}
- ✅ `deleteChapter(request)` - Maps to DELETE /api/chapters/delete

**LessonService** (`src/api/services/lesson-service.ts`):
- ✅ `createLesson(chapterId, request, videoFile)` - Maps to POST /api/lessons/{chapterId}
- ✅ `updateLesson(lessonId, request, videoFile)` - Maps to PUT /api/lessons/{id}
- ✅ `deleteLesson(request)` - Maps to DELETE /api/lessons/delete
- ✅ `uploadMaterial(lessonId, file)` - Maps to POST /api/lessons/{lessonId}/materials
- ✅ `getMaterials(lessonId)` - Maps to GET /api/lessons/{lessonId}/materials
- ✅ `deleteMaterial(lessonId, fileId)` - Maps to DELETE /api/lessons/{lessonId}/materials/{fileId}
- ✅ `downloadMaterial(lessonId, fileId)` - Maps to GET /api/lessons/{lessonId}/materials/{fileId}/download
- ✅ `deleteVideo(lessonId)` - Maps to DELETE /api/lessons/{lessonId}/video

### Hooks

**useCourses** (`src/hooks/useCourses.ts`):
- Uses SWR for caching and revalidation
- Provides `courses`, `totalElements`, `totalPages`, `currentPage`
- Mutations: `createCourse`, `updateCourse`, `deleteCourse`
- Auto-revalidates cache after mutations

**useMyCourses** (`src/hooks/useCourses.ts`):
- Fetches teacher's or student's courses
- Supports pagination
- Returns `courses`, `totalElements`, `totalPages`, `currentPage`

**useCourseCurriculum** (`src/hooks/useCourseCurriculum.ts`):
- Fetches course table of contents
- Returns `tableOfContents`, `course`, `chapters`, `enrolledCount`
- Mutation: `reorderTableOfContents`
- Cache duration: 5 minutes

### Data Types

**Request Types** (`src/types/request.ts`):
```typescript
CourseCreationRequest {
  title, description, difficulty, price, 
  teacherId, teacherName, status, categoryIds?
}

CourseUpdateRequest {
  title, description, difficulty, price, 
  status, categoryIds?
}

CourseWithContentRequest {
  course: CourseCreationRequest
  chapters?: ChapterWithLessonsRequest[]
}

ChapterRequest {
  title, courseId
}

LessonRequest {
  id?, title, type, content?, description, 
  duration, videoUrl?, orderIndex?
}

DeleteChapterRequest {
  chapterId, courseId
}

DeleteLessonRequest {
  lessonId, chapterId
}

ReorderTableOfContentsRequest {
  chapters: ChapterOrder[]
}

CoursesFilterParams {
  keyword?, status?, difficulty?, 
  teacherId?, categoryId?, 
  pageNumber?, pageSize?
}
```

**Response Types** (`src/types/response.ts`):
```typescript
CourseResponse {
  id, title, description, thumbnailUrl, 
  teacherName, teacherId, difficulty, price, 
  rating, status, categories, createdAt, updatedAt
}

ChapterResponse {
  id, title, orderIndex
}

LessonResponse {
  id, title, type, content, videoUrl, 
  description, duration, orderIndex, 
  createdAt, updatedAt
}

TableOfContentsResponse {
  courseResponse: CourseResponse
  enrolledCount: number
  chapters: ChapterTableOfContents[]
}

ChapterTableOfContents {
  id, title, orderIndex, lessonCount, 
  totalDuration, lessons: LessonTableOfContents[]
}

LessonTableOfContents {
  id, title, type, orderIndex, duration
}

PaginatedResponse<T> {
  content: T[]
  totalPages, totalElements, number, size, 
  first, last, empty, ...
}
```

**Enum Types** (`src/types/enum.ts`):
```typescript
enum CourseStatus { PUBLISHED, DRAFT }
enum Difficulty { BEGINNER, INTERMEDIATE, ADVANCED }
enum LessonType { VIDEO, YOUTUBE, MARKDOWN }
```

## Key Implementation Details

### 1. FormData Construction
For endpoints requiring `multipart/form-data`:
```typescript
const formData = new FormData();
formData.append('request', new Blob([JSON.stringify(request)], 
  {type: 'application/json'}));
if (thumbnail) {
  formData.append('thumbnail', thumbnail);
}
```

### 2. Pagination
- Backend uses `pageNumber` (1-indexed) and `pageSize`
- Backend returns `Page<T>` with:
  - `content`: Array of items
  - `number`: Current page (0-indexed)
  - `totalPages`: Total number of pages
  - `totalElements`: Total number of items

### 3. Delete Operations
ChapterController and LessonController use request body for DELETE:
```typescript
axiosInstance.delete('/api/chapters/delete', { 
  data: { chapterId, courseId } 
});
```

### 4. File Uploads
- Lesson creation/update: VideoFile in multipart form
- Material upload: Separate endpoint with file multipart
- Download: Returns blob with responseType: 'blob'

### 5. Navigation
- Table of Contents: Complete course structure with nested chapters/lessons
- Next/Previous: Navigation through lessons in order
- Permission check: Backend validates user access to course

## Components

✅ **CourseCard** - Display course with 3 variants (default, compact, detailed)
✅ **CourseForm** - Create/edit course with thumbnail upload
✅ **ChapterForm** - Create/edit chapter in modal dialog
✅ **LessonForm** - Create/edit lessons (VIDEO/YOUTUBE/MARKDOWN)

## Next Steps

1. **CurriculumBuilder** - Drag-and-drop interface for managing course structure
2. **Teacher Pages** - Course creation wizard, course list, course editor
3. **Student Pages** - Course browser, course detail, learning interface
4. **LessonViewer** - Display different lesson types (video player, markdown renderer)
5. **MaterialsList** - Display and manage lesson materials

## Testing Checklist

- [ ] Create course with thumbnail upload
- [ ] Update course with/without new thumbnail
- [ ] Delete course
- [ ] Search courses with various filters
- [ ] Get my courses (teacher and student views)
- [ ] Create/update/delete chapters
- [ ] Create/update/delete lessons (all 3 types)
- [ ] Upload/download/delete lesson materials
- [ ] Delete lesson videos
- [ ] Get table of contents
- [ ] Navigate next/previous lessons
- [ ] Reorder table of contents (drag-and-drop)
- [ ] Pagination on course lists
- [ ] Error handling for all operations
- [ ] Permission checks (teacher vs student)
