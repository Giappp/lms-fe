- src/app/(dashboard)/teacher/courses/new/page.tsx
    - Create course (template chooser → course editor → publish)
- src/app/(dashboard)/teacher/courses/[id]/page.tsx
    - Course detail / manage lessons & materials
- src/app/(dashboard)/teacher/courses/[id]/lessons/new/page.tsx
    - Add lesson / chapter
- src/app/(dashboard)/teacher/courses/[id]/lessons/[lessonId]/materials/page.tsx
    - Add/edit materials (upload / link)
- src/app/(dashboard)/teacher/enrollments/page.tsx
    - Student enrollment requests (accept/deny, bulk actions)
- src/app/(dashboard)/teacher/quizzes/page.tsx
    - Quizzes list (CRUD)
- src/app/(dashboard)/teacher/quizzes/templates/page.tsx
    - Quiz templates (CRUD)
- src/app/(dashboard)/teacher/quizzes/import/page.tsx
    - Import quizzes from Excel (preview → map columns → import)

# UX / UI patterns (high level)

## Layout

- Two-column responsive layout: left = navigation/sidebar, right = content form/editor.
- Use a persistent top bar with breadcrumb, save / publish actions, and status indicator.

## Course creation flow

- Stepper (Choose template → Basic info → Lessons → Materials → Review & Publish).
- Template cards grid with preview modal. Use lightweight animation when selecting a template.
- Inline validation and autosave (debounced save draft via API).

## Lesson & material editor

- Left side: lesson list (drag reorder) with compact rows; right side: editor panel for selected lesson.
- Support drag-and-drop material upload; inline preview for accepted types.
- Use modals for confirm delete and for adding complex content (embed, link).

## Enrollment management

- Table with filters (pending/accepted), search, bulk accept/decline, per-item actions.
- Batch accept with confirmation, animated row removal on accept/deny.

## Quiz & assignment builder

- Template store: cards with quick import. Ability to save templates.
- Editor splits: questions list + question editor (WYSIWYG or markdown). Support import from Excel: preview rows, map
  columns to question fields, validate before commit.

## Accessibility & responsiveness

- Keyboard-accessible controls, focus traps in modals, aria-live for save/publish status.
- High contrast support and accessible labels.

## Visual polish

- Use framer-motion for subtle enter/exit and list reorder animations.
- Consistent spacing, clear primary action (Save/Publish), micro-interactions (success toast).