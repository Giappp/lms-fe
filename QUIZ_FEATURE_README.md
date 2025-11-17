# Quiz Feature Documentation

## Overview
A comprehensive quiz management system for the LMS platform with features for both teachers and students.

## Features

### Teacher Features
- ✅ Create and manage quizzes (Lesson Quiz & Course Quiz)
- ✅ Add/edit/delete questions with multiple choice answers
- ✅ Configure quiz settings (time limit, attempts, passing percentage, scoring method)
- ✅ View detailed analytics and statistics
- ✅ Track student performance
- ✅ Review and provide feedback on attempts
- ✅ Import/export quiz questions

### Student Features
- ✅ Browse available quizzes
- ✅ Take timed quizzes with progress tracking
- ✅ Save progress and resume later
- ✅ View instant results after submission
- ✅ Access attempt history
- ✅ Review correct answers and explanations

## File Structure

```
src/
├── types/
│   ├── enum.ts                 # QuizType, QuestionType, ScoringMethod, AttemptStatus
│   ├── request.ts              # Quiz creation/update request types
│   └── response.ts             # Quiz/Question/Attempt response types
│
├── constants/
│   └── index.ts                # QUIZ_ROUTES API endpoints
│
├── components/shared/quiz/
│   ├── QuizCard.tsx            # Quiz overview card
│   ├── QuestionCard.tsx        # Individual question display
│   ├── AnswerOption.tsx        # Answer choice component
│   ├── QuizTimer.tsx           # Countdown timer
│   ├── QuizProgress.tsx        # Progress tracker with navigation
│   ├── QuizResultCard.tsx      # Result summary display
│   ├── AttemptHistoryCard.tsx  # Past attempt card
│   └── index.ts                # Re-exports
│
└── app/(dashboard)/
    ├── teacher/quizzes/
    │   ├── page.tsx                      # Quiz list & management
    │   ├── create/page.tsx               # Create new quiz
    │   └── analytics/[quizId]/page.tsx   # Analytics & statistics
    │
    └── student/quizzes/
        ├── page.tsx                      # Available quizzes (existing)
        └── take/[quizId]/page.tsx        # Take quiz interface
```

## Components

### QuizCard
Displays quiz overview with metadata and actions.

**Props:**
- `quiz`: QuizResponse
- `onStart?`: () => void
- `onView?`: () => void
- `onEdit?`: () => void
- `showActions?`: boolean
- `variant?`: "student" | "teacher"

**Features:**
- Shows quiz status (Active/Inactive, Available/Upcoming/Expired)
- Displays key info (questions count, time limit, passing %, attempts)
- Responsive design with hover effects

### QuestionCard
Renders a quiz question with answer options.

**Props:**
- `question`: QuestionResponse
- `questionNumber`: number
- `selectedAnswerIds?`: number[]
- `onAnswerChange?`: (answerIds: number[]) => void
- `showCorrectAnswer?`: boolean
- `showResult?`: boolean
- `isCorrect?`: boolean
- `readOnly?`: boolean

**Features:**
- Single choice question support
- Visual feedback for correct/incorrect answers
- Optional explanation display
- Accessibility support

### AnswerOption
Individual answer choice component.

**Props:**
- `answer`: AnswerResponse
- `answerLetter`: string
- `isSelected`: boolean
- `onSelect`: () => void
- `showCorrect?`: boolean
- `readOnly?`: boolean

**Features:**
- Letter badges (A, B, C, D)
- Visual states (normal, selected, correct, incorrect)
- Hover and focus states

### QuizTimer
Countdown timer for timed quizzes.

**Props:**
- `timeLimitMinutes`: number
- `startedAt`: Date
- `onTimeUp?`: () => void
- `mustSubmitBefore?`: Date

**Features:**
- Real-time countdown
- Warning state (< 5 minutes)
- Auto-submit on time expiry
- Sticky positioning

### QuizProgress
Progress tracker with question navigation.

**Props:**
- `totalQuestions`: number
- `answeredQuestions`: number
- `currentQuestionIndex?`: number
- `onQuestionClick?`: (index: number) => void

**Features:**
- Visual progress bar
- Grid-based question navigator
- Stats display (answered/remaining)
- Legend for states

### QuizResultCard
Displays quiz submission results.

**Props:**
- `result`: QuizSubmitResultResponse
- `passingPercentage`: number
- `onViewDetails?`: () => void
- `onRetake?`: () => void

**Features:**
- Pass/Fail status
- Score visualization
- Detailed statistics
- Action buttons

### AttemptHistoryCard
Shows past quiz attempts.

**Props:**
- `attempt`: QuizAttemptResponse
- `onView?`: () => void

**Features:**
- Attempt metadata
- Score and stats
- Teacher feedback display
- Status indicators

## Types

### Enums

```typescript
enum QuizType {
    LESSON_QUIZ = "LESSON_QUIZ",
    COURSE_QUIZ = "COURSE_QUIZ"
}

enum QuestionType {
    SINGLE_CHOICE = "SINGLE_CHOICE"
}

enum ScoringMethod {
    HIGHEST = "HIGHEST",
    LATEST = "LATEST",
    AVERAGE = "AVERAGE"
}

enum AttemptStatus {
    IN_PROGRESS = "IN_PROGRESS",
    SUBMITTED = "SUBMITTED",
    GRADED = "GRADED"
}
```

### Key Interfaces

```typescript
interface QuizResponse {
    id: number;
    title: string;
    description: string;
    quizType: QuizType;
    courseId: number;
    lessonId?: number;
    timeLimitMinutes: number;
    maxAttempts: number;
    passingPercentage: number;
    scoringMethod: ScoringMethod;
    isActive: boolean;
    shuffleQuestions: boolean;
    shuffleAnswers: boolean;
    showResults: boolean;
    showCorrectAnswers: boolean;
    questionCount: number;
    totalPoints: number;
    // ... timestamps
}

interface QuestionResponse {
    id: number;
    type: QuestionType;
    questionText: string;
    orderIndex: number;
    points: number;
    explanation?: string;
    answers: AnswerResponse[];
}

interface QuizAttemptResponse {
    id: number;
    quizId: number;
    quizTitle: string;
    attemptNumber: number;
    status: AttemptStatus;
    score: number;
    percentage: number;
    isPassed: boolean;
    // ... stats and review info
}
```

## API Routes

All API endpoints are defined in `src/constants/index.ts`:

```typescript
QUIZ_ROUTES = {
    LIST: "/api/quizzes",
    DETAIL: "/api/quizzes",
    CREATE: "/api/quizzes",
    UPDATE: "/api/quizzes",
    DELETE: "/api/quizzes",
    BY_COURSE: "/api/quizzes/course",
    BY_LESSON: "/api/quizzes/lesson",
    
    // Question management
    ADD_QUESTION: "/api/quizzes/questions",
    UPDATE_QUESTION: "/api/quizzes/questions",
    DELETE_QUESTION: "/api/quizzes/questions",
    REORDER_QUESTIONS: "/api/quizzes/questions/reorder",
    
    // Student actions
    START: "/api/quiz-attempts/start",
    SAVE_PROGRESS: "/api/quiz-attempts/save-progress",
    SUBMIT: "/api/quiz-attempts/submit",
    MY_ATTEMPTS: "/api/quiz-attempts/my-attempts",
    ATTEMPT_DETAIL: "/api/quiz-attempts",
    
    // Statistics & Analytics
    ANALYTICS: "/api/quizzes/analytics",
    COURSE_STATISTICS: "/api/quizzes/statistics/course",
    STUDENT_HISTORY: "/api/quiz-attempts/student/history",
    
    // Import/Export
    IMPORT: "/api/quizzes/import",
    EXPORT: "/api/quizzes/export"
}
```

## Pages

### Teacher: Quiz Management (`/teacher/quizzes`)
- List all quizzes with filters (type, status)
- Search functionality
- Create new quiz button
- Edit/View actions per quiz

### Teacher: Create Quiz (`/teacher/quizzes/create`)
- Quiz basic info form
- Question builder
- Answer options with correct marking
- Real-time question list preview
- Save and validation

### Teacher: Analytics (`/teacher/quizzes/analytics/[quizId]`)
- Overview stats (students, avg score, pass rate, avg time)
- Score distribution
- Attempt status breakdown
- Per-question performance analysis

### Student: Take Quiz (`/student/quizzes/take/[quizId]`)
- Timer and progress tracker
- Question navigation
- Answer selection
- Save progress functionality
- Submit with confirmation
- Instant results display

## Usage Examples

### Using QuizCard

```tsx
import { QuizCard } from "@/components/shared/quiz";

<QuizCard
    quiz={quizData}
    variant="student"
    onStart={() => router.push(`/student/quizzes/take/${quizData.id}`)}
    onView={() => router.push(`/student/quizzes/${quizData.id}`)}
/>
```

### Using QuestionCard with State

```tsx
const [answers, setAnswers] = useState<Record<number, number[]>>({});

<QuestionCard
    question={question}
    questionNumber={1}
    selectedAnswerIds={answers[question.id] || []}
    onAnswerChange={(answerIds) => {
        setAnswers(prev => ({ ...prev, [question.id]: answerIds }));
    }}
/>
```

### Using QuizTimer

```tsx
<QuizTimer
    timeLimitMinutes={30}
    startedAt={startTime}
    onTimeUp={handleAutoSubmit}
/>
```

## Styling

All components use:
- **shadcn/ui** components (Card, Button, Badge, Progress, etc.)
- **Tailwind CSS** utility classes
- **theme.css** CSS variables for consistent theming
- **Responsive design** with mobile-first approach
- **Dark mode support** via Tailwind dark: prefix

## Mock Data

All pages include mock data for demonstration:
- Example quizzes with various configurations
- Sample questions and answers
- Attempt history with results
- Analytics data

## Next Steps

To integrate with backend:

1. Create API service layer (`src/api/services/quiz-service.ts`)
2. Implement SWR hooks (`src/hooks/useQuizzes.ts`)
3. Replace mock data with API calls
4. Add loading and error states
5. Implement optimistic updates
6. Add form validation with Zod schemas

## Notes

- All TypeScript types match Java backend DTOs
- Component props are strongly typed
- Responsive design tested on mobile/tablet/desktop
- Accessibility features included (ARIA labels, keyboard navigation)
- Dark mode compatible
