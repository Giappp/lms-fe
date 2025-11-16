# AI Development Instructions — concise & actionable

Purpose: give an AI coding agent the exact, discoverable patterns and files needed to be productive in this LMS frontend (Next.js 15, React 19, TypeScript).

## Quick start

```bash
npm run dev        # dev server (Next.js + Turbopack)
npm run build      # production build
npm start          # run production
npm run lint       # ESLint
npm run backend    # json-server mock (db.json) on :8080
```

## Read these files first (big picture)
- `src/app/` — Next.js app router (route groups: `(auth)`, `(dashboard)`, `(landing-page)`).
- `src/contexts/auth-context.tsx` — central auth state + SWR user fetch.
- `src/api/core/axiosInstance.ts` — Authorization header injection and token refresh queue.
- `src/hooks/` — SWR-based hooks (e.g. `useCourses.ts`, `useAuth.ts`).
- `src/api/services/` — API wrappers that call `axiosInstance`.

## Patterns to follow (exactly)
- SWR key must include full path + query string. Example (see `src/hooks/useCourses.ts`):

```ts
const key = `${Constants.COURSES_ROUTES.LIST}?${queryString}`;
```

- Always call `mutate()` after successful POST/PUT/DELETE to keep UI consistent.
- Use `swrFetcher` / `apiCall` for consistent ApiResponse handling (`src/api/core/swrFetcher.ts`).
- Use `Constants` for routes and localStorage keys — don't hardcode URLs (`src/constants/index.ts`).

## Authentication specifics
- `AuthContext` exposes: `user`, `isLoading`, `signIn`, `logOut`, `mutateUser`.
- `axiosInstance` request interceptor adds `Authorization: Bearer <token>` if available.
- `axiosInstance` response interceptor refreshes tokens on 401 and queues concurrent requests to avoid races (see `src/api/core/axiosInstance.ts`).
- On refresh failure the app dispatches `window.dispatchEvent(new Event('auth:logout'))`.
- Tokens live in `localStorage` under keys from `Constants.LOCAL_STORAGE_KEYS`.
- OAuth flows redirect the browser (see `AuthService.oauthSignIn` in `src/api/services/auth-service.ts`).

## Services & types
- Add service functions under `src/api/services/` (use `axiosInstance`).
- Types: requests in `src/types/request.ts`, responses in `src/types/response.ts`, enums in `src/types/enum.ts`.

## UI & component conventions
- UI primitives: `src/components/ui/` (shadcn/ui + Tailwind).
- Feature components grouped by domain under `src/components/{student,teacher,auth,shared}`.
- Add `"use client"` on interactive components (forms/widgets); prefer smallest scope.

## Copy-paste examples
- SWR hook skeleton (mutate after writes):

```ts
const key = `${Constants.COURSES_ROUTES.LIST}?${queryString}`;
const { data, mutate } = useSWR<PaginatedResponse<CourseResponse> | null>(key, { revalidateOnFocus: false });
const create = async (form: FormData) => {
  const res = await CourseService.createCourseWithBasicInfo(form);
  if ((res as any)?.success) await mutate();
};
```

- Axios refresh pattern: request interceptor + response interceptor that refreshes token, updates `localStorage`, updates axios default header and retries pending requests. See `src/api/core/axiosInstance.ts`.

## When adding a feature (order)
1. Add types in `src/types/`.
2. Add API calls in `src/api/services/` using `axiosInstance`.
3. Add a SWR hook under `src/hooks/` and ensure `mutate()` is called after writes.
4. Add components under `src/components/` and wire into `src/app/` pages.

## Common pitfalls (avoid)
- Don’t create new axios instances — use the single `axiosInstance`.
- Don’t hardcode backend URLs — use `Constants.BACKEND_URL` and `Constants.AUTH_ROUTES`.
- Don’t skip `mutate()` after writes — UI will show stale data.
- Don't create new SWR fetchers — use the shared `swrFetcher` for consistent error handling.