# AI Development Instructions for LMS Frontend

## Project Architecture

This is a Next.js-based Learning Management System (LMS) frontend with the following key characteristics:

### Directory Structure

- `/src/app/` - Next.js app router pages and layouts
- `/src/components/` - Reusable UI components, primarily using shadcn/ui
- `/src/api/` - API services and axios configuration
- `/src/hooks/` - Custom React hooks for data fetching and state management
- `/src/types/` - TypeScript type definitions
- `/src/lib/` - Utility functions and helpers

### Key Patterns

1. **Data Fetching**

```typescript
// Use SWR hooks for data fetching
const useCourses = (filters: CoursesFilterParams) => {
    const {data, error, isLoading} = useSWR<CourseResponse>(
        `/courses?${queryString}`,
        fetcher
    );
    // ...
}
```

2. **Component Organization**

- Pages are in `src/app/` following Next.js app router conventions
- UI components use shadcn/ui with Tailwind CSS
- Component hierarchy: Layout -> Page -> Feature Components -> UI Components

3. **State Management**

- SWR for server state
- React hooks for local state
- Context for auth and theme state

## Development Workflows

1. **Running the Project**

```bash
npm run dev  # Start development server
```

2. **Adding New UI Components**

```bash
npx shadcn-ui@latest add [component-name]
```

3. **API Integration**

- Use the `axios` instance from `/api/core/axios.ts`
- Create service files in `/api/services/`
- Use SWR hooks in `/hooks/` for data fetching

## Project Conventions

1. **File Organization**

- Feature components go in `/components`
- Shared UI components go in `/components/ui/`
- Types are defined in `/types/response.ts` and `/types/request.ts`

2. **Component Patterns**

- Use shadcn/ui components as base building blocks
- Follow atomic design principles
- Implement responsive layouts using Tailwind CSS

3. **Data Fetching**

- Create custom hooks for API calls
- Use SWR for caching and revalidation
- Follow the service pattern in `/api/services/`

## Key Files and Examples

1. **Course Detail Page Structure** (`/app/(dashboard)/student/learn/[id]/page.tsx`):

```typescript
type Props = {
    params: string
};

const Page = ({params}: Props) => {
    const courseId = params;
    // Implementation...
}
```

2. **Custom Hook Pattern** (`/hooks/useCourses.ts`):

```typescript
export const useCourses = (filters: CoursesFilterParams) => {
    // Implementation using SWR
}
```

## Common Tasks

1. **Adding a New Feature**

- Create component in appropriate `/components/` directory
- Add necessary types to `/types/`
- Create API service in `/api/services/`
- Create custom hook in `/hooks/`

2. **Styling Components**

- Use Tailwind CSS classes
- Extend shadcn/ui components as needed
- Follow the project's color scheme and design system

## Integration Points

1. **Authentication**

- Handled through `/hooks/useAuth.ts`
- Protected routes in `/app/(dashboard)/`
- Auth middleware for API routes

2. **API Services**

- REST API communication via axios
- Service files define endpoint interactions
- Response types in `/types/response.ts`

Remember to maintain consistency with existing patterns when adding new features or modifying existing ones.