Teacher components for managing courses

Files added

- `CourseCard.tsx` — small card for a single course with View/Edit actions.
- `CourseList.tsx` — main client component with tabs (Published / Drafts), search and refresh. Uses `useCourses` hook.
- `CourseDetailsDrawer.tsx` — right-sheet to show course details and quick Edit button.
- `EditCourseModal.tsx` — modal wrapping the existing `BasicInfoForm` to edit basic course info.

How to use

1. The `CourseList` component is already wired into the teacher route at
   `src/app/(dashboard)/teacher/my-courses/page.tsx`.
2. Open the app in dev mode:

```bash
npm run dev
```

3. Sign in as a teacher and visit the Teacher > My Courses page (typically `/teacher/my-courses`).

Notes & assumptions

- `BasicInfoForm` (used inside `EditCourseModal`) should accept `initialData`, `onSaveAction` and `serverErrors` props;
  this project already contains a `BasicInfoForm.tsx` under `src/components/teacher/`.
- The `Course` type in `src/types/response.ts` does not expose category IDs, so the edit form sends an empty
  `categoryId` array when mapping initial values. If the backend expects category IDs, update the `Course` type or fetch
  full course detail before editing.
- Images use `next/image` and assume `course.thumbnail` is a valid absolute or Next-compatible path.

Suggested next steps / UX improvements

- Add loading skeletons for the course cards and the details drawer.
- Add pagination or infinite scroll for large course lists.
- Improve search with debounced queries and server-side filtering.
- Allow draft -> publish actions inline and add bulk actions (publish/delete).
- Add confirmation dialogs for destructive actions (delete/unpublish).
- Ensure category selection in the edit form maps to real category IDs.
- Add accessibility: aria-labels, keyboard focus traps for dialogs/sheets.

If you'd like, I can now:

- add loading skeletons and debounce the search input,
- wire category ID mapping by fetching full course detail before editing,
- or create unit tests for these components.


