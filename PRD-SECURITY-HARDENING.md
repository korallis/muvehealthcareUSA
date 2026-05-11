# PRD: Muve Healthcare Staging Site - Security Hardening & Production Readiness

**Document Version:** 1.1
**Date:** 13 February 2026
**Author:** Engineering Team
**Status:** Draft
**Priority:** P0 (Critical)
**Project:** muvehealthcaresitestaging
**Stack:** Next.js 16.1, React 19, Drizzle ORM 0.45, PostgreSQL (Neon), Upstash Redis, Vercel Blob, Microsoft Graph API, Puck CMS

---

## 1. Executive Summary

A comprehensive code review of the Muve Healthcare staging site has revealed **27 issues** across 4 severity levels: 5 critical, 8 high, 7 medium, and 7 low. The most severe findings include **unauthenticated server actions** allowing anyone to create/update/delete content, **XSS vulnerabilities** in email templates and rendered HTML, a **hardcoded JWT fallback secret**, and **zero input validation** across all data mutation paths.

As a **UK-based healthcare organisation website**, the site must comply with **UK GDPR** and the **Data Protection Act 2018**. The ICO reported in late 2025 that over 95% of the UK's top 1,000 websites now meet cookie compliance standards, and enforcement has moved from guidance to active intervention. The site collects personal data through contact forms, feedback forms, and admin accounts, making GDPR compliance mandatory. This PRD addresses both technical security and the GDPR obligations that fall within the engineering scope.

This PRD defines the scope, requirements, and implementation plan for remediating all identified issues and bringing the application to production-ready status.

### 1.1 Architectural Context: Public Website with Admin Backend

This application is a **public-facing healthcare website**, not a private application. The auth model is:

- **Public (no auth required):** All pages under `app/(root)/*` — News, Events, Careers, FAQs, Quicklinks, Stories, Contact, About, Privacy, and CMS-managed pages via the `[[...slug]]` catch-all route. All read-only server actions and GET API routes that serve these pages are correctly public.
- **Admin only (auth required):** All pages under `app/dashboard/*` — content management for News, Events, Jobs, FAQs, Quicklinks, Stories, CMS page editor, categories, and admin settings. All **mutation** server actions (create/update/delete) and POST/PATCH/DELETE API routes must require `authGuard('admin')`.
- **Auth mechanism:** Custom JWT using `jose`, stored in httpOnly cookie `authToken`. Middleware (`middleware.ts`) protects `/dashboard/*` routes only. Server Actions bypass middleware entirely, so each mutation must call `authGuard()` independently.

This distinction is critical — adding auth to read-only public actions would break the website for all visitors.

---

## 2. Problem Statement

### 2.1 Current State

The application is deployed to Vercel at `muvehealthcaresitestaging.vercel.app` with the following critical gaps:

| Area                   | Current State                                                                | Risk                                                    |
| ---------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Server Action Auth** | 9 mutation server actions + 2 API routes have zero `authGuard()` calls       | Anyone can create/update/delete content via direct POST |
| **Input Validation**   | No Zod schemas, no length limits, no format checks on any mutation           | Stored XSS, data corruption, injection                  |
| **JWT Secret**         | Falls back to hardcoded string `"build-time-fallback-not-for-production"`    | Complete auth bypass if env var missing                 |
| **HTML Rendering**     | `dangerouslySetInnerHTML` used without `sanitizeHTML()` in 4 page components | XSS via database content                                |
| **Email Templates**    | User data directly concatenated into HTML strings in 4 email files           | XSS in email clients                                    |
| **Rate Limiting**      | `lib/rate-limit.ts` exists but is never imported or called                   | Unlimited abuse on all endpoints                        |
| **Security Headers**   | No CSP, HSTS, X-Frame-Options, or Referrer-Policy configured                 | OWASP Top 10 exposure                                   |
| **Password Policy**    | No minimum length, complexity, or common password checks                     | Trivial password attacks                                |
| **CSRF Protection**    | No CSRF tokens on any POST endpoint                                          | Cross-site request forgery                              |
| **Error Boundaries**   | Zero `error.tsx` files in the entire application                             | White screen on any component crash                     |
| **Testing**            | Zero test files, no test framework, no CI/CD                                 | No regression safety net                                |
| **Database Indexes**   | No indexes on any foreign key or slug column                                 | Performance degradation at scale                        |

### 2.2 Business Impact

- **Data integrity risk:** Unauthenticated users can modify public-facing FAQ, quicklinks, category content, and **overwrite any CMS page** (including the homepage) via the unprotected `savePageAction`
- **Reputational risk:** XSS attacks on a healthcare website erode patient trust
- **Compliance risk:** The site collects personal data (contact forms, feedback, admin accounts) without GDPR-compliant consent mechanisms, privacy policy links, or data subject rights implementation. ICO fines for GDPR violations can reach up to 4% of annual turnover or GBP 17.5 million
- **Operational risk:** No error tracking, no testing, no CI/CD means issues are discovered by users, not engineers

---

## 3. Goals & Success Criteria

### 3.1 Goals

1. **Eliminate all critical and high-severity vulnerabilities** identified in the code review
2. **Implement defence-in-depth** with multiple security layers (auth, validation, sanitisation, CSP, rate limiting)
3. **Establish a testing and CI/CD foundation** to prevent regressions
4. **Improve production observability** with error tracking, structured logging, and health checks
5. **Harden the database layer** with proper indexes, constraints, and type safety

### 3.2 Success Criteria

| Metric                                         | Target                   |
| ---------------------------------------------- | ------------------------ |
| Critical vulnerabilities remaining             | 0                        |
| High vulnerabilities remaining                 | 0                        |
| All mutation server actions have `authGuard()` | 100%                     |
| All mutations validated with Zod schemas       | 100%                     |
| All `dangerouslySetInnerHTML` usage sanitised  | 100%                     |
| Security headers score (securityheaders.com)   | A+                       |
| `error.tsx` coverage on route segments         | 100% of dashboard + root |
| Test coverage on server actions                | >80%                     |
| Build passes with zero TypeScript errors       | Yes                      |
| Lighthouse security audit                      | Pass                     |
| GDPR cookie consent banner present             | Yes                      |
| Privacy policy page linked from all forms      | Yes                      |
| Data subject deletion capability               | Yes                      |

---

## 4. Scope

### 4.1 In Scope

| Phase                             | Work Area                                                                     | Issues Addressed                   |
| --------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------- |
| **Phase 1: Critical Security**    | Auth bypass, JWT secret, XSS, password policy                                 | #1, #2, #3, #4, #5                 |
| **Phase 2: High Security**        | CSRF, input validation, rate limiting, file upload, security headers, indexes | #6, #7, #8, #9, #10, #11, #12, #13 |
| **Phase 3: Stability & Quality**  | Error boundaries, type safety, schema fixes, config cleanup                   | #14, #15, #16, #17, #18, #19, #20  |
| **Phase 4: Production Readiness** | Testing, CI/CD, monitoring, SEO, accessibility, GDPR compliance               | #21, #22, #23, #24, #25, #26, #27  |

### 4.2 Out of Scope

- Complete UI/UX redesign
- Performance optimisation beyond indexing
- Multi-tenancy or role-based access beyond admin/user
- Migration to third-party auth providers (we are keeping custom JWT auth with `jose`)
- HIPAA compliance (not required for this project)
- Full DPO appointment or DPIA process (organisational, not engineering)

---

## 5. Detailed Requirements

---

### Phase 1: Critical Security Fixes (P0 - Immediate)

**Target: 1-2 days**

---

#### 5.1 REQ-001: Add Authorization to All Mutation Server Actions & API Routes

**Issue:** This is a **public-facing healthcare website**. Most pages (News, Events, Careers, FAQs, Quicklinks, Stories, CMS pages) are intended to be publicly accessible — only the `/dashboard/*` admin backend requires authentication. However, 9 mutation server actions and 2 API route handlers that **create, update, or delete content** have no `authGuard()` calls. Because Next.js Server Actions are public POST endpoints (confirmed by Next.js 16.1 documentation and CVE-2025-29927 advisory), they can be invoked directly by anyone without going through middleware.

**Most critically, `savePageAction` in `lib/actions/editor.ts` allows any unauthenticated user to overwrite ANY CMS page content — including the homepage.**

**Reference:** [The Hidden Security Risks of Next.js Server Actions](https://medium.com/@joseph.goins/the-hidden-security-risks-of-next-js-server-actions-and-how-to-protect-them-5964cf012951) (Oct 2025); [MakerKit Server Actions Guide](https://makerkit.dev/blog/tutorials/nextjs-server-actions) (Jan 2026)

**Auth Model Clarification:**

The following actions are **correctly public** and must NOT have auth added (they serve the public website):

| Action                         | File                                                                | Reason Public                                   |
| ------------------------------ | ------------------------------------------------------------------- | ----------------------------------------------- |
| `getFAQsAction`                | `app/dashboard/faq/actions.ts`                                      | Read-only, serves public FAQ page               |
| `getQuicklinksAction`          | `app/dashboard/quicklinks/actions.ts`                               | Read-only, serves public quicklinks page        |
| `getFAQCategoriesAction`       | `app/dashboard/categories/faq/faq-category-actions.ts`              | Read-only, used for public FAQ filtering        |
| `getQuicklinkCategoriesAction` | `app/dashboard/categories/quicklinks/quicklink-category-actions.ts` | Read-only, used for public quicklinks filtering |
| `getPageDataAction`            | `lib/actions/editor.ts`                                             | Read-only, serves the catch-all CMS page route  |
| `getAllCategoriesAction`       | `app/dashboard/categories/shared/shared-category-actions.ts`        | Read-only, used for public page category lists  |
| `getJobsAction`                | `app/dashboard/jobs/actions.ts`                                     | Read-only, serves public careers page           |
| `getStoriesAction`             | `app/dashboard/stories/actions.ts`                                  | Read-only, serves public stories page           |
| Public GET API routes          | `app/api/faq/route.ts`, `app/api/events/route.ts`, etc.             | Read-only GET endpoints for public data         |

**Requirements:**

1. Add `await authGuard('admin')` as the **first line** of every mutation function in the following files:

   **Server Actions (missing auth):**
   - `app/dashboard/faq/actions.ts` → `createFAQAction`, `updateFAQAction`, `deleteFAQAction`
   - `app/dashboard/quicklinks/actions.ts` → `createQuicklinkAction`, `updateQuicklinkAction`, `deleteQuicklinkAction`
   - `app/dashboard/categories/faq/faq-category-actions.ts` → `createFAQCategoryAction`
   - `app/dashboard/categories/quicklinks/quicklink-category-actions.ts` → `createQuicklinkCategoryAction`
   - `lib/actions/editor.ts` → `savePageAction` **(CRITICAL — allows overwriting any CMS page including homepage)**

   **API Routes (missing auth):**
   - `app/api/faq/[slug]/route.ts` → `PATCH` handler, `DELETE` handler

   **Already correctly protected (no changes needed):**
   - `app/dashboard/news/actions.ts` — all mutations have `authGuard`
   - `app/dashboard/events/actions.ts` — all mutations have `authGuard`
   - `app/dashboard/jobs/actions.ts` — all mutations have `authGuard`
   - `app/dashboard/stories/actions.ts` — all mutations have `authGuard`
   - `app/api/news/route.ts` — POST has auth check
   - `app/api/events/route.ts` — POST has auth check
   - `app/api/upload/route.ts` — auth protected
   - `app/api/puck/route.ts` — auth protected

2. For `getAllPagesAction` in `lib/actions/editor.ts`: add `authGuard('admin')` — this lists all CMS pages and is only used by the dashboard editor, not public pages.

3. Implement the **Safe Action pattern** recommended for Next.js 16 production apps:

```typescript
// lib/safe-action.ts
import { authGuard } from "@/lib/auth-guard";
import { z } from "zod";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export function createProtectedAction<TInput, TOutput>(
  schema: z.Schema<TInput>,
  action: (data: TInput) => Promise<TOutput>,
): (input: TInput) => Promise<ActionResult<TOutput>> {
  return async (input: TInput) => {
    await authGuard("admin");
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }
    try {
      const result = await action(parsed.data);
      return { success: true, data: result };
    } catch (err) {
      console.error("[Action Error]", err);
      return { success: false, error: "An unexpected error occurred." };
    }
  };
}
```

**Acceptance Criteria:**

- [ ] Every **mutation** server action calls `authGuard('admin')` before any database operation
- [ ] Every **mutation** API route handler (POST/PATCH/DELETE) calls `authGuard('admin')`
- [ ] Read-only actions serving public pages remain unauthenticated
- [ ] `savePageAction` requires admin auth (critical fix)
- [ ] `getAllPagesAction` requires admin auth
- [ ] `app/api/faq/[slug]/route.ts` PATCH and DELETE require admin auth
- [ ] Unauthenticated requests to mutation actions return an error (not a redirect)
- [ ] Unit test confirms unauthenticated calls are rejected for all 11 endpoints

---

#### 5.2 REQ-002: Remove JWT Secret Fallback

**Issue:** `lib/auth-config.ts` line 1 uses `process.env.AUTH_SECRET || "build-time-fallback-not-for-production"`. If the env var is missing, anyone can forge admin JWT tokens using the known fallback string.

**Requirements:**

1. Remove the fallback string entirely. The application must **fail to start** if `AUTH_SECRET` is not set.

2. Implement environment variable validation at application startup:

```typescript
// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  DATABASE_URL: z.string().url(),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  MICROSOFT_GRAPH_TENANT_ID: z.string().uuid(),
  MICROSOFT_GRAPH_CLIENT_ID: z.string().uuid(),
  MICROSOFT_GRAPH_CLIENT_SECRET: z.string().min(1),
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
});

export const env = envSchema.parse(process.env);
```

3. Import `env` in `lib/auth-config.ts` instead of reading `process.env` directly:

```typescript
// lib/auth-config.ts
import { env } from "./env";
export const JWT_SECRET = new TextEncoder().encode(env.AUTH_SECRET);
```

4. Create `.env.example` with all required variables (values redacted).

**Acceptance Criteria:**

- [ ] Application throws a clear error on startup if any required env var is missing
- [ ] `.env.example` exists in the repository
- [ ] `JWT_SECRET` is derived from validated env var only

---

#### 5.3 REQ-003: Sanitize All `dangerouslySetInnerHTML` Usage

**Issue:** Four page components render database content as raw HTML without sanitization, despite `lib/sanitize.ts` already existing and being used correctly in `puck.config.tsx`.

**Files to fix:**

- `app/(root)/News/[slug]/page.tsx` line ~102
- `app/(root)/Careers/[slug]/page.tsx` (job description + requirements)
- `app/(root)/events/[slug]/page.tsx` (event description)
- `components/Footer.tsx` lines ~46, ~57

**Requirements:**

1. Import and apply `sanitizeHTML()` from `lib/sanitize.ts` to every `dangerouslySetInnerHTML` value:

```tsx
// Before (VULNERABLE)
<div dangerouslySetInnerHTML={{ __html: news.content || "" }} />;

// After (SAFE)
import { sanitizeHTML } from "@/lib/sanitize";
<div dangerouslySetInnerHTML={{ __html: sanitizeHTML(news.content || "") }} />;
```

2. Audit `lib/sanitize.ts` to ensure it uses `isomorphic-dompurify` with a strict allowlist:
   - Allowed tags: `p, br, strong, em, ul, ol, li, h1-h6, a, img, blockquote, code, pre, table, thead, tbody, tr, th, td`
   - Allowed attributes: `href, src, alt, class, style` (with style limited to safe properties)
   - Strip `javascript:` URLs, `on*` event handlers, `data:` URIs (except images)

3. Add a **lint rule or grep check** to CI that flags any `dangerouslySetInnerHTML` not wrapped in `sanitizeHTML()`.

**Acceptance Criteria:**

- [ ] Zero instances of unsanitised `dangerouslySetInnerHTML` in the codebase
- [ ] DOMPurify configured with explicit allowlists
- [ ] CI check prevents future unsanitised usage

---

#### 5.4 REQ-004: Sanitize Email Template Content

**Issue:** Four email files concatenate user-controlled data directly into HTML strings. A user submitting `<script>alert('xss')</script>` as their name would inject it into emails.

**Files to fix:**

- `lib/actions/invite.ts` (lines ~62-67)
- `lib/actions/email.ts` (lines ~59-64)
- `lib/actions/feedbackForm.ts` (lines ~64-72)
- `lib/actions/contactEmails.ts` (lines ~60-64)

**Requirements:**

1. Create an `escapeHtml()` utility for email content:

```typescript
// lib/escape-html.ts
const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (char) => ESCAPE_MAP[char]);
}
```

2. Apply `escapeHtml()` to all user-supplied values before HTML interpolation:

```typescript
// Before (VULNERABLE)
content: `<p><strong>Name:</strong> ${firstName} ${lastName}</p>`;

// After (SAFE)
import { escapeHtml } from "@/lib/escape-html";
content: `<p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>`;
```

3. Apply to every user-controlled field in all 4 email files: `name`, `email`, `message`, `firstName`, `lastName`, `phone`, `feedbackType`, `userType`, `fullName`.

4. URL-encode the `email` parameter in invite links:

```typescript
const inviteLink = `${baseUrl}/auth/signup?token=${inviteToken}&email=${encodeURIComponent(email)}`;
```

**Acceptance Criteria:**

- [ ] All user data in email HTML is escaped
- [ ] Invite link email parameter is URL-encoded
- [ ] No raw user input appears in HTML email strings

---

#### 5.5 REQ-005: Implement Password Strength Requirements

**Issue:** `lib/actions/auth.ts` accepts any string as a password with no validation.

**Requirements:**

1. Add a password validation schema:

```typescript
// lib/validation/auth.ts
import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(320),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
```

2. Apply `signupSchema` in the signup action before hashing.

3. Apply `loginSchema` in the login action before database lookup.

4. Return **generic error messages** for login failures to prevent user enumeration:

```typescript
// Before (LEAKS INFO)
if (err.code === "23505")
  return { error: "User with this email already exists." };

// After (SAFE)
// Signup: keep specific message (user needs to know)
// Login: always return generic message
return { error: "Invalid email or password." };
```

5. Add client-side password strength indicator on the signup form.

**Acceptance Criteria:**

- [ ] Passwords under 8 characters are rejected
- [ ] Password must contain uppercase, lowercase, and number
- [ ] Login returns generic error message regardless of failure reason
- [ ] Client-side validation matches server-side rules

---

### Phase 2: High Security Fixes (P1 - This Sprint)

**Target: 3-5 days**

---

#### 5.6 REQ-006: Add Security Headers

**Issue:** No security headers configured in `next.config.ts` or middleware.

**Reference:** [Next.js CSP Documentation](https://nextjs.org/docs/pages/guides/content-security-policy) (v16.1.6, updated Feb 2026)

**Requirements:**

1. Add security headers in `next.config.ts`:

```typescript
const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data: *.public.blob.vercel-storage.com *.vercel.app www.muvehealthcare.com utfs.io",
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];
```

2. Add `poweredByHeader: false` to `next.config.ts`.

3. Remove the `example.com` placeholder from `images.remotePatterns`.

**Acceptance Criteria:**

- [ ] All headers present in production response
- [ ] securityheaders.com scan returns A or A+
- [ ] `X-Powered-By` header is absent

---

#### 5.7 REQ-007: Implement Input Validation with drizzle-zod

**Issue:** No input validation on any mutation server action or API route. All user-submitted data flows directly to the database. Read-only actions (which serve the public website) do not accept complex user input, so validation focus is on the mutation paths and public form submissions.

**Reference:** [drizzle-zod documentation](https://orm.drizzle.team/docs/zod) (v0.8.x); [Contract-Driven Development with Drizzle, NextJS and Zod](https://medium.com/@tonyvantur/type-safe-validation-with-drizzle-and-orpc-c7e4cba6ffd8) (Jan 2026)

**Requirements:**

1. Install `drizzle-zod` and `zod`:

```bash
bun add drizzle-zod zod
```

2. Generate Zod schemas from the Drizzle schema using `createInsertSchema` and `createUpdateSchema` with refinements:

```typescript
// lib/validation/schemas.ts
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import {
  faqs,
  quicklinks,
  newsArticles,
  events,
  jobs,
  stories,
  faqCategories,
  quicklinkCategories,
} from "@/db/schema";

// FAQ schemas
export const createFAQSchema = createInsertSchema(faqs, {
  question: (s) => s.min(3, "Question is required").max(500),
  answer: (s) => s.min(3, "Answer is required").max(5000),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const updateFAQSchema = createUpdateSchema(faqs, {
  question: (s) => s.min(3).max(500),
  answer: (s) => s.min(3).max(5000),
}).omit({ id: true, createdAt: true, updatedAt: true });

// News schemas
export const createNewsSchema = createInsertSchema(newsArticles, {
  title: (s) => s.min(3, "Title is required").max(200),
  content: (s) => s.max(50000),
  excerpt: (s) => s.max(500),
  slug: (s) => s.max(200).regex(/^[a-z0-9-]+$/),
}).omit({ id: true, createdAt: true, updatedAt: true });

// Events schemas
export const createEventSchema = createInsertSchema(events, {
  title: (s) => s.min(3, "Title is required").max(200),
  location: (s) => s.max(300),
  description: (s) => s.max(50000),
})
  .omit({ id: true, createdAt: true, updatedAt: true })
  .refine(
    (data) =>
      !data.endDate ||
      !data.startDate ||
      new Date(data.endDate) > new Date(data.startDate),
    { message: "End date must be after start date", path: ["endDate"] },
  );

// Jobs schemas
export const createJobSchema = createInsertSchema(jobs, {
  title: (s) => s.min(3, "Title is required").max(200),
  description: (s) => s.max(50000),
  requirements: (s) => s.max(50000),
  location: (s) => s.max(300),
}).omit({ id: true, createdAt: true, updatedAt: true });

// Stories schemas
export const createStorySchema = createInsertSchema(stories, {
  name: (s) => s.min(1, "Name is required").max(100),
  role: (s) => s.max(100),
  content: (s) => s.min(1, "Content is required").max(10000),
}).omit({ id: true, createdAt: true, updatedAt: true });

// Category schemas
export const createFAQCategorySchema = createInsertSchema(faqCategories, {
  name: (s) => s.min(1, "Name is required").max(100),
}).omit({ id: true });

export const createQuicklinkCategorySchema = createInsertSchema(
  quicklinkCategories,
  {
    name: (s) => s.min(1, "Name is required").max(100),
  },
).omit({ id: true });

// Puck CMS page data schema (for savePageAction)
export const savePageSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(
      /^[a-z0-9\-\/]+$/,
      "Slug must be lowercase alphanumeric with hyphens",
    ),
  data: z.object({
    root: z.record(z.unknown()),
    content: z.array(z.record(z.unknown())),
  }),
});

// URL validation helper for image/download URLs
export const safeUrlSchema = z
  .string()
  .url()
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return ["https:", "http:"].includes(parsed.protocol);
      } catch {
        return false;
      }
    },
    { message: "URL must use http or https protocol" },
  );
```

3. Apply schemas in every server action using `.safeParse()`:

```typescript
export async function createFAQAction(data: unknown) {
  await authGuard("admin");
  const parsed = createFAQSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  // ... proceed with parsed.data
}
```

4. Apply schemas in every API route handler for request body validation.

5. Validate URL fields (`imageUrl`, `downloadUrl`, `featuredImg`) with `safeUrlSchema` to prevent `javascript:` and `data:` URI injection.

**Acceptance Criteria:**

- [ ] Every server action validates input with a Zod schema before database operations
- [ ] Every API POST/PUT handler validates the request body
- [ ] Invalid input returns a descriptive error message
- [ ] URL fields reject non-http(s) protocols

---

#### 5.8 REQ-008: Activate Rate Limiting

**Issue:** `lib/rate-limit.ts` defines Upstash rate limiters but they are never imported or used anywhere.

**Reference:** [Rate-limiting Server Actions in Next.js](https://javascript.plainenglish.io/rate-limiting-server-actions-in-next-js-the-essential-security-practice-youre-probably-missing-7f3b4c37df71) (Jan 2026); [Implementing Rate Limiting in Next.js with Upstash Redis](https://rcweb.dev/blog/rate-limiting-nextjs-upstash-redis) (Dec 2025)

**Requirements:**

1. Apply rate limiting to endpoints based on the public-website auth model. Public read endpoints need lighter limits (to support normal browsing), while form submissions and auth endpoints need stricter limits:

| Endpoint                            | Limit       | Window     | Identifier | Rationale                 |
| ----------------------------------- | ----------- | ---------- | ---------- | ------------------------- |
| `POST /api/feedback`                | 5 requests  | 1 minute   | IP address | Public form submission    |
| Contact/service form submissions    | 5 requests  | 1 minute   | IP address | Public form submission    |
| `POST /auth/login` (loginAction)    | 5 attempts  | 15 minutes | IP + email | Brute-force prevention    |
| `POST /auth/signup` (signupAction)  | 3 attempts  | 1 hour     | IP address | Account creation abuse    |
| All authenticated dashboard actions | 30 requests | 1 minute   | User ID    | Admin mutation protection |
| Public GET API routes               | 60 requests | 1 minute   | IP address | Normal browsing tolerance |

2. Apply rate limiting in middleware for API routes:

```typescript
// In middleware.ts, add rate limiting for /api/* routes
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const apiLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  analytics: true,
  prefix: "ratelimit:api",
});
```

3. For Server Actions, use IP-based rate limiting via `headers()`:

```typescript
import { headers } from "next/headers";

async function getClientIP(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}
```

4. Return structured rate limit responses:
   - API routes: `429 Too Many Requests` with `Retry-After` header
   - Server actions: `{ error: "Too many requests. Please try again later." }`

**Acceptance Criteria:**

- [ ] `/api/feedback` is rate limited to 5 req/min per IP
- [ ] Login is rate limited to 5 attempts/15min per IP+email
- [ ] Dashboard actions are rate limited to 30 req/min per user
- [ ] Rate limit responses include `Retry-After` header on API routes

---

#### 5.9 REQ-009: Harden File Upload Security

**Issue:** `app/api/upload/route.ts` only checks `file.type` (MIME type), which is client-controlled and trivially spoofed.

**Requirements:**

1. Add magic byte validation for uploaded files:

```typescript
const MAGIC_BYTES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF header
  "image/gif": [[0x47, 0x49, 0x46, 0x38]], // GIF8
};

function validateMagicBytes(buffer: ArrayBuffer, mimeType: string): boolean {
  const bytes = new Uint8Array(buffer.slice(0, 8));
  const signatures = MAGIC_BYTES[mimeType];
  if (!signatures) return false;
  return signatures.some((sig) => sig.every((byte, i) => bytes[i] === byte));
}
```

2. Add filename sanitisation:

```typescript
function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, ".")
    .slice(0, 200);
}
```

3. Add file size limits: max 5MB per file.

4. Add rate limiting: max 10 uploads per minute per user.

**Acceptance Criteria:**

- [ ] Files with spoofed MIME types are rejected
- [ ] Filenames are sanitised before storage
- [ ] Files over 5MB are rejected
- [ ] Upload endpoint is rate limited

---

#### 5.10 REQ-010: Add Database Indexes

**Issue:** No indexes on foreign key columns or slug columns used in public URL lookups.

**Requirements:**

1. Add indexes to the Drizzle schema:

```typescript
// In db/schema.ts, add indexes to each table

// Foreign key indexes
export const faqCategoryIdIdx = index("faq_category_id_idx").on(
  faqs.categoryId,
);
export const quicklinkCategoryIdIdx = index("quicklink_category_id_idx").on(
  quicklinks.categoryId,
);
export const newsCategoryIdIdx = index("news_category_id_idx").on(
  newsArticles.categoryId,
);
export const newsImageArticleIdIdx = index("news_image_article_id_idx").on(
  newsImages.articleId,
);
export const eventCategoryIdIdx = index("event_category_id_idx").on(
  events.categoryId,
);
export const eventCreatedByIdIdx = index("event_created_by_id_idx").on(
  events.createdById,
);
export const jobCategoryIdIdx = index("job_category_id_idx").on(
  jobs.categoryId,
);

// Slug indexes (used in public URL lookups)
export const newsSlugIdx = uniqueIndex("news_slug_idx").on(newsArticles.slug);
export const eventSlugIdx = uniqueIndex("event_slug_idx").on(events.slug);
export const jobSlugIdx = uniqueIndex("job_slug_idx").on(jobs.slug);

// User email index
export const userEmailIdx = uniqueIndex("user_email_idx").on(users.email);
```

2. Generate and apply the migration:

```bash
bun run db:generate
bun run db:migrate
```

3. Add `onDelete` cascade rules to foreign keys:
   - `faqs.categoryId` -> `onDelete: 'set null'`
   - `quicklinks.categoryId` -> `onDelete: 'set null'`
   - `newsImages.articleId` -> `onDelete: 'cascade'`

**Acceptance Criteria:**

- [ ] All foreign key columns have indexes
- [ ] All slug columns used in public routes have unique indexes
- [ ] Migration generated and applied successfully
- [ ] `onDelete` rules defined for all foreign keys

---

#### 5.11 REQ-011: Standardise JWT Library

**Issue:** Both `jsonwebtoken` and `jose` are installed. Middleware uses `jose`, auth actions use both.

**Requirements:**

1. Remove `jsonwebtoken` and `@types/jsonwebtoken` from dependencies.
2. Refactor all JWT operations to use `jose` exclusively.
3. Update `lib/actions/auth.ts` to use `jose` for token signing (it may already, but verify all imports).

```bash
bun remove jsonwebtoken @types/jsonwebtoken
```

**Acceptance Criteria:**

- [ ] `jsonwebtoken` is not in `package.json`
- [ ] All JWT operations use `jose`
- [ ] Build passes without `jsonwebtoken`

---

### Phase 3: Stability & Quality (P2 - Next Sprint)

**Target: 5-7 days**

---

#### 5.12 REQ-012: Add Error Boundaries

**Issue:** Zero `error.tsx` files. Component crashes cause white screens.

**Reference:** [Next.js Error Handling](https://nextjs.org/docs/app/getting-started/error-handling) (v16.1.6, updated Feb 2026); [Complete Guide to Next.js Error Boundary](https://eastondev.com/blog/en/posts/dev/20260106-nextjs-error-boundary-guide/) (Jan 2026)

**Requirements:**

1. Create `app/error.tsx` (root error boundary):

```tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="mt-2 text-gray-600">
          We apologise for the inconvenience.
        </p>
        <button
          onClick={reset}
          className="mt-4 rounded bg-[#1F3154] px-4 py-2 text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
```

2. Create `app/global-error.tsx` (catches root layout errors).

3. Create `app/dashboard/error.tsx` (dashboard-specific error boundary with "Back to Dashboard" link).

4. Create `app/(root)/error.tsx` (public pages error boundary).

5. Add `loading.tsx` files to key route segments:
   - `app/dashboard/loading.tsx`
   - `app/(root)/News/[slug]/loading.tsx`
   - `app/(root)/Careers/[slug]/loading.tsx`
   - `app/(root)/events/[slug]/loading.tsx`

**Acceptance Criteria:**

- [ ] `error.tsx` exists at root, dashboard, and public route levels
- [ ] `global-error.tsx` exists at app root
- [ ] `loading.tsx` exists for dynamic route segments
- [ ] Component errors show friendly UI instead of white screen

---

#### 5.13 REQ-013: Eliminate `any` Types

**Issue:** 15+ instances of `any` type across the codebase, including component props, server action parameters, and API route handlers.

**Requirements:**

1. Define proper TypeScript interfaces for all component props:

```typescript
// types/index.ts (extend existing)
export interface NavbarProps {
  logo?: string;
  links?: Array<{
    label: string;
    href: string;
    children?: Array<{ label: string; href: string }>;
  }>;
  puck?: { isEditing: boolean };
}

export interface FooterProps {
  logo?: string;
  ukOffice?: string;
  irelandOffice?: string;
  policies?: Array<{ title: string; content: string }>;
  puck?: { isEditing: boolean };
}
```

2. Replace `data: any` in all server actions with validated Zod inferred types:

```typescript
import { z } from 'zod';
import { createStorySchema } from '@/lib/validation/schemas';

type CreateStoryInput = z.infer<typeof createStorySchema>;

export async function createStoryAction(data: CreateStoryInput) { ... }
```

3. Replace `as any` casts with proper type assertions or generics.

4. Enable stricter TypeScript options in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**Acceptance Criteria:**

- [ ] Zero `any` types in application code (excluding third-party type definitions)
- [ ] `noImplicitAny: true` in tsconfig
- [ ] All component props have explicit interfaces
- [ ] Build passes with stricter TypeScript config

---

#### 5.14 REQ-014: Fix Database Schema Issues

**Issue:** Mixed primary key types, missing NOT NULL constraints, untyped enum columns, missing timestamps.

**Requirements:**

1. Standardise on UUID primary keys (the `stories` table uses `serial` while all others use UUID). Migrate `stories.id` to UUID in a migration.

2. Add NOT NULL constraints:
   - `users.name` -> `.notNull()`
   - `users.email` -> `.notNull()`

3. Convert untyped text columns to Drizzle `pgEnum`:

```typescript
export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);
export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "expired",
]);
export const jobTypeEnum = pgEnum("job_type", [
  "full_time",
  "part_time",
  "contract",
]);
```

4. Add `updatedAt` timestamps to tables that are missing them.

5. Standardise field naming: choose either `createdById` or `authorId` and apply consistently.

**Acceptance Criteria:**

- [ ] All tables use UUID primary keys
- [ ] `users.name` and `users.email` are NOT NULL
- [ ] Enum columns use `pgEnum` instead of `text`
- [ ] All tables have `createdAt` and `updatedAt` timestamps
- [ ] Migration generated and tested

---

#### 5.15 REQ-015: Fix Configuration Issues

**Issue:** Duplicate PostCSS configs, env var typo, VSCode dead config, README inconsistencies.

**Requirements:**

1. **Delete `postcss.config.js`**, keep only `postcss.config.mjs`, and add `autoprefixer`:

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
export default config;
```

2. Fix env var typo: `NEXT_PUBLIC_BUILDER_API_KE` -> `NEXT_PUBLIC_BUILDER_API_KEY` (in `.env`, `.env.example`, and all consuming code).

3. Remove dead VSCode config (`prisma.pinToPrisma6: true` - Prisma is not used).

4. Add recommended VSCode extensions:
   - `bradlc.vscode-tailwindcss`
   - `dbaeumer.vscode-eslint`

5. Update `README.md` to use `bun` instead of `npm`.

6. Remove unused `jsdom` from `serverExternalPackages` in `next.config.ts`.

**Acceptance Criteria:**

- [ ] Only one PostCSS config file exists
- [ ] Env var name is corrected everywhere
- [ ] README commands use `bun`
- [ ] Dead VSCode config removed

---

#### 5.16 REQ-016: Implement Server-Side Session Invalidation

**Issue:** Logout only deletes the cookie. JWT tokens remain valid until expiry with no revocation mechanism.

**Requirements:**

1. Implement a token blocklist using Upstash Redis:

```typescript
// lib/auth/token-blocklist.ts
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function revokeToken(
  token: string,
  expiresInSeconds: number,
): Promise<void> {
  await redis.set(`blocklist:${token}`, "1", { ex: expiresInSeconds });
}

export async function isTokenRevoked(token: string): Promise<boolean> {
  const result = await redis.get(`blocklist:${token}`);
  return result !== null;
}
```

2. On logout, add the current token to the blocklist with TTL matching remaining JWT expiry.

3. In middleware, check the blocklist before allowing access:

```typescript
if (await isTokenRevoked(token)) {
  const response = NextResponse.redirect(new URL("/auth/login", request.url));
  response.cookies.delete("authToken");
  return response;
}
```

**Acceptance Criteria:**

- [ ] Logout adds token to Redis blocklist
- [ ] Middleware checks blocklist on every authenticated request
- [ ] Revoked tokens cannot access dashboard

---

#### 5.17 REQ-017: Fix Hardcoded Placeholder Values

**Issue:** `components/AccessibilityWidget.tsx` has `tel:+123456789` (a fake placeholder phone number live on the site).

**Requirements:**

1. Replace with actual Muve Healthcare phone number or environment variable.
2. Audit all components for other hardcoded placeholders:
   - `components/GetInTouch/Contact/index.tsx` - verify phone number `0808 1754091` is correct
   - `components/Social/Value/index.tsx` - verify Canva URL
   - Cognito form URLs in footer - verify they're correct

**Acceptance Criteria:**

- [ ] No placeholder phone numbers on the live site
- [ ] All hardcoded URLs and phone numbers are verified correct

---

### Phase 4: Production Readiness (P3 - Following Sprint)

**Target: 5-10 days**

---

#### 5.18 REQ-018: Establish Testing Infrastructure

**Issue:** Zero test files, no test framework configured.

**Requirements:**

1. Install Vitest and testing utilities:

```bash
bun add -d vitest @testing-library/react @testing-library/jest-dom happy-dom
```

2. Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

3. Add test script to `package.json`: `"test": "vitest"`, `"test:ci": "vitest run"`

4. Write tests for **all server actions** (highest priority):
   - Test that unauthenticated calls are rejected
   - Test that invalid input is rejected
   - Test happy path CRUD operations
   - Test rate limiting triggers

5. Write tests for **all API routes**:
   - Test auth guard enforcement
   - Test input validation
   - Test error responses

6. Minimum coverage targets:
   - Server actions: 80%
   - API routes: 80%
   - Auth utilities: 90%

**Acceptance Criteria:**

- [ ] Vitest configured and running
- [ ] Server action tests exist and pass
- [ ] API route tests exist and pass
- [ ] `bun run test` passes in CI

---

#### 5.19 REQ-019: Set Up CI/CD Pipeline

**Issue:** No GitHub Actions, no pre-commit hooks, no automated quality gates.

**Requirements:**

1. Create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run typecheck
      - run: bun run lint
      - run: bun run test:ci
      - run: bun run build
```

2. Add pre-commit hooks with lint-staged:

```bash
bun add -d husky lint-staged
```

```json
// package.json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

3. Add branch protection rules on `main`:
   - Require CI to pass before merge
   - Require at least 1 review

**Acceptance Criteria:**

- [ ] CI runs on every PR
- [ ] Typecheck, lint, test, and build must pass
- [ ] Pre-commit hooks enforce formatting
- [ ] Branch protection enabled on main

---

#### 5.20 REQ-020: Add Error Tracking & Monitoring

**Issue:** Only `console.log`/`console.error` for logging, 27+ instances in production code.

**Requirements:**

1. Integrate Sentry (free tier) or Vercel's built-in error tracking:

```bash
bun add @sentry/nextjs
```

2. Configure Sentry with source maps for production builds.

3. Replace `console.error` calls in server actions and API routes with structured error reporting:

```typescript
import * as Sentry from "@sentry/nextjs";

// In catch blocks:
Sentry.captureException(error, {
  tags: { action: "createFAQ", userId: session?.userId },
});
```

4. Remove or guard `console.log` statements:
   - Remove debug-only logs
   - Replace information-bearing logs with structured logging
   - Ensure no sensitive data (tokens, passwords, emails) is logged

5. Create a health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local",
  });
}
```

**Acceptance Criteria:**

- [ ] Sentry configured and capturing errors
- [ ] Zero `console.log` in production code paths
- [ ] No sensitive data in log output
- [ ] `/api/health` returns status

---

#### 5.21 REQ-021: Improve SEO & Accessibility

**Issue:** Most pages lack metadata, Open Graph tags, and structured data. Multiple accessibility gaps including missing alt text and ARIA labels.

**Requirements:**

1. Add metadata to all public page routes using Next.js `generateMetadata`:

```typescript
// app/(root)/News/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const news = await getNewsBySlug(params.slug);
  return {
    title: `${news.title} | Muve Healthcare`,
    description: news.excerpt,
    openGraph: {
      title: news.title,
      description: news.excerpt,
      images: news.featuredImg ? [{ url: news.featuredImg }] : [],
      type: "article",
    },
    twitter: { card: "summary_large_image" },
  };
}
```

2. Add JSON-LD structured data for:
   - Organisation schema on homepage
   - Article schema on news pages
   - JobPosting schema on careers pages
   - Event schema on events pages

3. Fix accessibility issues:
   - Replace empty `alt=""` with descriptive text for meaningful images
   - Add `aria-label` to icon-only buttons (search toggle, mobile menu)
   - Add focus trap to AccessibilityWidget dialog
   - Add keyboard escape handler to mobile nav menu
   - Ensure all interactive elements have visible focus styles

4. Fix the AccessibilityWidget to prevent background scroll when open.

**Acceptance Criteria:**

- [ ] All public pages have unique title and description
- [ ] Open Graph and Twitter card meta tags on all content pages
- [ ] JSON-LD structured data on homepage, news, careers, events
- [ ] No empty alt text on meaningful images
- [ ] ARIA labels on all icon-only buttons
- [ ] Lighthouse accessibility score >= 90

---

#### 5.22 REQ-022: Add Audit Logging for Security Events

**Issue:** No logging of failed login attempts, admin actions, or security events.

**Requirements:**

1. Create an audit log table:

```typescript
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(), // 'login', 'login_failed', 'create_faq', 'delete_event', etc.
  resource: text("resource"), // 'faq', 'news', 'event', etc.
  resourceId: text("resource_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata"), // Additional context
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

2. Log security events:
   - Failed login attempts (with IP and email)
   - Successful logins
   - Admin invitation creation
   - Content create/update/delete operations
   - Rate limit triggers
   - File uploads

3. Create a dashboard page at `/dashboard/audit-log` showing recent actions (admin only).

**Acceptance Criteria:**

- [ ] Audit log table exists with migration
- [ ] Failed logins are logged with IP
- [ ] All CRUD operations log the actor and action
- [ ] Dashboard page shows audit trail

---

#### 5.23 REQ-023: Implement GDPR Compliance (UK GDPR & Data Protection Act 2018)

**Issue:** The site collects personal data through contact forms, feedback forms, service enquiry forms, and admin accounts but has no GDPR compliance mechanisms. There is no cookie consent banner, no privacy policy linked from forms, no data retention policy, and no mechanism for data subject rights (access, deletion, rectification). The ICO has moved to active enforcement in 2026, with over 95% of top UK websites now compliant.

**Reference:** [GDPR Compliance Checklist for Next.js Apps](https://medium.com/@kidane10g/gdpr-compliance-checklist-for-next-js-apps-801c9ea75780) (Oct 2025); [Cookie Consent for Next.js - Termly](https://termly.io/resources/articles/cookie-consent-for-next-js/) (Jan 2026); [Cookie Compliance in 2026: Where GDPR Enforcement Stands Now](https://www.gerrishlegal.com/blog/cookie-compliance-in-2026-where-gdpr-enforcement-stands-now) (Dec 2025)

**Requirements:**

**A. Cookie Consent Banner**

1. Implement a cookie consent banner that appears on first visit before any non-essential cookies are set:

```typescript
// components/CookieConsent.tsx
'use client';

import { useState, useEffect } from 'react';

type ConsentPreferences = {
  essential: true; // Always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
};

const DEFAULT_CONSENT: ConsentPreferences = {
  essential: true,
  analytics: false,
  marketing: false,
};

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>(DEFAULT_CONSENT);

  useEffect(() => {
    const stored = localStorage.getItem('cookie-consent');
    if (!stored) setShowBanner(true);
    else setPreferences(JSON.parse(stored));
  }, []);

  function acceptAll() {
    const consent = { essential: true, analytics: true, marketing: true };
    save(consent);
  }

  function rejectNonEssential() {
    save(DEFAULT_CONSENT);
  }

  function save(consent: ConsentPreferences) {
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setPreferences(consent);
    setShowBanner(false);
    // Only load analytics/marketing scripts AFTER consent
    if (consent.analytics) loadAnalytics();
  }

  if (!showBanner) return null;

  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed bottom-0 inset-x-0 z-50 bg-white border-t shadow-lg p-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-4">
        <p className="text-sm text-gray-700 flex-1">
          We use cookies to improve your experience. Essential cookies are required for the site to function.
          You can choose to accept or reject optional cookies.
          See our <a href="/Privacy" className="underline text-[#1F3154]">Privacy Policy</a> and
          <a href="/cookies" className="underline text-[#1F3154]"> Cookie Policy</a> for details.
        </p>
        <div className="flex gap-2">
          <button onClick={rejectNonEssential} className="px-4 py-2 border rounded text-sm">
            Reject Non-Essential
          </button>
          <button onClick={acceptAll} className="px-4 py-2 bg-[#1F3154] text-white rounded text-sm">
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
```

2. Rejecting cookies must be **equally easy** as accepting them (ICO requirement - no dark patterns).

3. No non-essential cookies or tracking scripts may load before consent is granted.

4. Provide a "Manage Cookie Preferences" link in the footer that re-opens the consent dialog.

5. Store consent choice with timestamp for audit purposes.

**B. Privacy & Cookie Policy Pages**

1. Create `/cookies` page listing all cookies used, their purpose, duration, and whether they are essential or optional.

2. Update the existing `/Privacy` page to include:
   - What personal data is collected and why (lawful basis)
   - How data is stored and for how long
   - Who data is shared with (Microsoft Graph for emails, Vercel for hosting, Neon for database, Upstash for caching)
   - Data subject rights (access, rectification, erasure, portability, objection)
   - Contact details for data requests
   - ICO complaint procedure

3. Link the privacy policy from every form that collects personal data:
   - Contact form (`components/ui/ContactUsForm.tsx`)
   - Feedback form (`components/ui/FeedbackForms.tsx`)
   - Service enquiry form (`components/ui/ServiceForm.tsx`)
   - Signup form (`app/auth/signup/page.tsx`)

**C. Data Subject Rights Implementation**

1. Create a data subject request mechanism:

```typescript
// app/api/data-request/route.ts
export async function POST(request: Request) {
  const { email, requestType } = await request.json();
  // requestType: 'access' | 'deletion' | 'rectification' | 'portability'

  // Validate email format
  // Rate limit: 1 request per email per 24 hours
  // Log the request in audit_logs
  // Send confirmation email to the requestor
  // Notify admin of pending data request

  return Response.json({
    message: "Your request has been received. We will respond within 30 days.",
  });
}
```

2. Implement admin dashboard page at `/dashboard/data-requests` to manage incoming requests.

3. Implement account deletion capability:
   - Delete user record from `users` table
   - Delete associated `invitations` records
   - Anonymise audit log entries (replace userId with "deleted-user")
   - Confirm deletion via email

4. Implement data export (portability):
   - Export all personal data associated with an email address as JSON
   - Include: user profile, form submissions, audit log entries

**D. Data Minimisation & Retention**

1. Audit all form fields and remove any that are not strictly necessary:
   - Review feedback form fields
   - Review contact form fields
   - Review service enquiry form fields

2. Implement data retention policies:
   - Feedback form submissions: auto-delete after 2 years
   - Audit logs: retain for 1 year, then anonymise
   - Inactive admin accounts: flag for review after 6 months of inactivity

3. Add retention cleanup as a scheduled task (Vercel Cron or similar):

```typescript
// app/api/cron/data-retention/route.ts
export async function GET(request: Request) {
  // Verify cron secret
  // Delete feedback submissions older than 2 years
  // Anonymise audit logs older than 1 year
  // Flag inactive admin accounts
}
```

**E. Consent on Forms**

1. Add explicit consent checkboxes to all public-facing forms:

```tsx
<label className="flex items-start gap-2 text-sm">
  <input type="checkbox" name="consent" required className="mt-1" />
  <span>
    I agree to the processing of my personal data as described in the{" "}
    <a href="/Privacy" className="underline">
      Privacy Policy
    </a>
    . I understand I can withdraw consent at any time. *
  </span>
</label>
```

2. Store the consent timestamp and IP address with each form submission for audit purposes.

3. Do not process form submissions without explicit consent checkbox being checked.

**F. Email Communications**

1. All emails sent via Microsoft Graph must include:
   - Link to privacy policy
   - Unsubscribe mechanism (for marketing emails)
   - Muve Healthcare contact details

2. Admin invitation emails should state what data will be collected and link to the privacy policy.

**Acceptance Criteria:**

- [ ] Cookie consent banner appears on first visit
- [ ] Non-essential cookies are not set before consent
- [ ] Rejecting cookies is equally easy as accepting them
- [ ] "Manage Cookie Preferences" link in footer
- [ ] Cookie policy page lists all cookies with purpose and duration
- [ ] Privacy policy covers all GDPR required disclosures
- [ ] Privacy policy linked from all forms collecting personal data
- [ ] Consent checkbox on all public forms
- [ ] Data subject access request endpoint functional
- [ ] Data deletion capability implemented
- [ ] Data export (portability) capability implemented
- [ ] Data retention policy documented and automated
- [ ] Emails include privacy policy link

---

## 6. Implementation Timeline

| Phase                             | Duration  | Dependencies     | Deliverables            |
| --------------------------------- | --------- | ---------------- | ----------------------- |
| **Phase 1: Critical Security**    | 1-2 days  | None             | REQ-001 through REQ-005 |
| **Phase 2: High Security**        | 3-5 days  | Phase 1 complete | REQ-006 through REQ-011 |
| **Phase 3: Stability & Quality**  | 5-7 days  | Phase 2 complete | REQ-012 through REQ-017 |
| **Phase 4: Production Readiness** | 5-10 days | Phase 3 complete | REQ-018 through REQ-023 |

**Total estimated effort: 14-24 days**

---

## 7. Risk Assessment

| Risk                                     | Likelihood | Impact | Mitigation                                                           |
| ---------------------------------------- | ---------- | ------ | -------------------------------------------------------------------- |
| Schema migration breaks existing data    | Medium     | High   | Test migrations on staging first, take Neon snapshot before applying |
| Rate limiting blocks legitimate users    | Low        | Medium | Start with generous limits, monitor and tune                         |
| CSP headers break existing functionality | Medium     | Medium | Deploy in report-only mode first, then enforce                       |
| Auth changes lock out admins             | Medium     | High   | Keep a superadmin recovery mechanism; test auth flow thoroughly      |
| drizzle-zod version incompatibility      | Low        | Low    | Pin exact versions; test schema generation                           |

---

## 8. Testing Strategy

### 8.1 Per-Phase Testing

| Phase   | Test Type          | What to Test                                                        |
| ------- | ------------------ | ------------------------------------------------------------------- |
| Phase 1 | Manual + Unit      | Auth bypass attempts, XSS payloads in forms/emails, weak passwords  |
| Phase 2 | Unit + Integration | Rate limit triggers, CSP header presence, Zod validation edge cases |
| Phase 3 | Unit + Regression  | Error boundary rendering, type safety, migration correctness        |
| Phase 4 | E2E + Automated    | Full user flows, CI pipeline, Lighthouse audits                     |

### 8.2 Security Testing Checklist

- [ ] Attempt all 9 mutation server action calls without auth cookie
- [ ] Attempt `savePageAction` without auth cookie (must fail — previously would overwrite CMS pages)
- [ ] Attempt `PATCH /api/faq/[slug]` and `DELETE /api/faq/[slug]` without auth cookie
- [ ] Verify read-only actions (getFAQsAction, getQuicklinksAction, etc.) work WITHOUT auth (public website)
- [ ] Submit `<script>alert(1)</script>` in all form fields
- [ ] Submit `<img src=x onerror=alert(1)>` in all text fields
- [ ] Attempt file upload with executable disguised as image
- [ ] Test rate limiting with rapid sequential requests
- [ ] Verify CSP blocks inline script execution
- [ ] Attempt JWT forgery with known fallback secret (should fail)
- [ ] Test login with 1-character password (should fail)
- [ ] Verify logout invalidates the session
- [ ] Verify cookie consent banner appears on first visit
- [ ] Verify no non-essential cookies are set before consent
- [ ] Verify rejecting cookies works and no tracking loads
- [ ] Verify data subject access request returns correct data
- [ ] Verify data deletion removes all personal data
- [ ] Verify all public forms have consent checkbox and privacy policy link

---

## 9. Dependencies & Prerequisites

| Dependency               | Purpose                  | Version |
| ------------------------ | ------------------------ | ------- |
| `zod`                    | Runtime validation       | ^3.25.0 |
| `drizzle-zod`            | Schema-to-Zod generation | ^0.8.0  |
| `vitest`                 | Unit testing             | ^3.x    |
| `@testing-library/react` | Component testing        | ^16.x   |
| `@sentry/nextjs`         | Error tracking           | ^9.x    |
| `husky`                  | Git hooks                | ^9.x    |
| `lint-staged`            | Pre-commit formatting    | ^15.x   |

**Remove:**
| Package | Reason |
|---------|--------|
| `jsonwebtoken` | Replaced by `jose` |
| `@types/jsonwebtoken` | No longer needed |

---

## 10. Rollback Plan

Each phase should be deployed as a separate PR with the ability to revert:

1. **Phase 1:** If auth changes lock out admins, revert the PR and manually reset the auth cookie/JWT via database
2. **Phase 2:** If CSP breaks functionality, remove the CSP header first (other headers are safe to keep)
3. **Phase 3:** If migration fails, restore from Neon snapshot taken before migration
4. **Phase 4:** CI/CD and monitoring are additive; no rollback needed

---

## 11. Definition of Done

A phase is considered complete when:

1. All requirements in the phase have passing acceptance criteria
2. All new code has been reviewed in a PR
3. Build passes (`bun run build`)
4. TypeScript check passes (`bun run typecheck`)
5. Lint passes (`bun run lint`)
6. Tests pass (from Phase 4 onwards: `bun run test`)
7. Manual security testing checklist items verified
8. Deployed to staging and smoke tested

---

## 12. Appendix

### A. Files Requiring Changes (Complete List)

**Phase 1:**

- `lib/auth-config.ts` - Remove fallback secret
- `lib/actions/auth.ts` - Password validation, generic errors
- `lib/actions/invite.ts` - Sanitise email HTML
- `lib/actions/email.ts` - Sanitise email HTML
- `lib/actions/feedbackForm.ts` - Sanitise email HTML
- `lib/actions/contactEmails.ts` - Sanitise email HTML
- `app/(root)/News/[slug]/page.tsx` - Sanitise dangerouslySetInnerHTML
- `app/(root)/Careers/[slug]/page.tsx` - Sanitise dangerouslySetInnerHTML
- `app/(root)/events/[slug]/page.tsx` - Sanitise dangerouslySetInnerHTML
- `components/Footer.tsx` - Sanitise dangerouslySetInnerHTML
- `app/dashboard/faq/actions.ts` - Add authGuard to mutations (createFAQAction, updateFAQAction, deleteFAQAction)
- `app/dashboard/quicklinks/actions.ts` - Add authGuard to mutations (createQuicklinkAction, updateQuicklinkAction, deleteQuicklinkAction)
- `app/dashboard/categories/faq/faq-category-actions.ts` - Add authGuard to createFAQCategoryAction
- `app/dashboard/categories/quicklinks/quicklink-category-actions.ts` - Add authGuard to createQuicklinkCategoryAction
- `lib/actions/editor.ts` - Add authGuard to savePageAction and getAllPagesAction **(CRITICAL — currently allows unauthenticated page overwrites)**
- `app/api/faq/[slug]/route.ts` - Add authGuard to PATCH and DELETE handlers

**Phase 2 (new files):**

- `lib/env.ts` - Environment validation
- `lib/escape-html.ts` - HTML escaping utility
- `lib/validation/schemas.ts` - Zod schemas
- `lib/validation/auth.ts` - Auth schemas
- `lib/safe-action.ts` - Protected action wrapper

**Phase 2 (modified files):**

- `next.config.ts` - Security headers, poweredByHeader
- `middleware.ts` - Rate limiting, blocklist check
- `app/api/upload/route.ts` - Magic byte validation
- `app/api/feedback/route.ts` - Rate limiting, validation
- `db/schema.ts` - Indexes, constraints, enums
- All server action files - Zod validation
- All API route files - Zod validation

**Phase 3 (new files):**

- `app/error.tsx`
- `app/global-error.tsx`
- `app/dashboard/error.tsx`
- `app/(root)/error.tsx`
- `app/dashboard/loading.tsx`
- Various `loading.tsx` files
- `lib/auth/token-blocklist.ts`

**Phase 3 (modified files):**

- `tsconfig.json` - Stricter options
- `postcss.config.mjs` - Add autoprefixer
- `postcss.config.js` - DELETE
- `.vscode/settings.json` - Remove dead config
- `README.md` - Use bun commands
- `types/index.ts` - Add interfaces
- All components with `any` props

**Phase 4 (new files):**

- `vitest.config.ts`
- `tests/setup.ts`
- `tests/actions/*.test.ts`
- `tests/api/*.test.ts`
- `.github/workflows/ci.yml`
- `.env.example`
- `app/api/health/route.ts`
- `app/dashboard/audit-log/page.tsx`
- `components/CookieConsent.tsx` - GDPR cookie consent banner
- `app/(root)/cookies/page.tsx` - Cookie policy page
- `app/api/data-request/route.ts` - Data subject rights endpoint
- `app/dashboard/data-requests/page.tsx` - Admin data request management
- `app/api/cron/data-retention/route.ts` - Automated data retention cleanup

**Phase 4 (modified files):**

- `app/(root)/Privacy/page.tsx` - Expand privacy policy to GDPR requirements
- `components/ui/ContactUsForm.tsx` - Add consent checkbox + privacy link
- `components/ui/FeedbackForms.tsx` - Add consent checkbox + privacy link
- `components/ui/ServiceForm.tsx` - Add consent checkbox + privacy link
- `app/auth/signup/page.tsx` - Add consent checkbox + privacy link
- `app/(root)/layout.tsx` - Add CookieConsent component
- `components/Footer.tsx` - Add "Manage Cookie Preferences" link
- `lib/actions/invite.ts` - Add privacy policy link to emails
- `lib/actions/email.ts` - Add privacy policy link to emails
- `lib/actions/feedbackForm.ts` - Add privacy policy link to emails
- `lib/actions/contactEmails.ts` - Add privacy policy link to emails

### B. Research Sources

- [Next.js 16 Security & Authentication Best Practices](https://medium.com/@sureshdotariya/robust-security-authentication-best-practices-in-next-js-16-6265d2d41b13) (Nov 2025)
- [Next.js CSP Documentation v16.1.6](https://nextjs.org/docs/pages/guides/content-security-policy) (Feb 2026)
- [CVE-2025-29927: Next.js Middleware Vulnerability](https://securityboulevard.com/2026/01/cve-2025-29927-understanding-the-next-js-middleware-vulnerability-2/) (Jan 2026)
- [Complete Next.js Security Guide 2025](https://www.turbostarter.dev/blog/complete-nextjs-security-guide-2025-authentication-api-protection-and-best-practices) (Jul 2025)
- [Next.js Server Actions: The Complete Guide 2026](https://makerkit.dev/blog/tutorials/nextjs-server-actions) (Jan 2026)
- [Rate-limiting Server Actions in Next.js](https://javascript.plainenglish.io/rate-limiting-server-actions-in-next-js-the-essential-security-practice-youre-probably-missing-7f3b4c37df71) (Jan 2026)
- [Implementing Rate Limiting with Upstash Redis](https://rcweb.dev/blog/rate-limiting-nextjs-upstash-redis) (Dec 2025)
- [drizzle-zod Documentation](https://orm.drizzle.team/docs/zod) (v0.8.x)
- [Contract-Driven Development with Drizzle, Next.js and Zod](https://medium.com/@tonyvantur/type-safe-validation-with-drizzle-and-orpc-c7e4cba6ffd8) (Jan 2026)
- [Drizzle ORM PostgreSQL Best Practices 2025](https://gist.github.com/productdevbook/7c9ce3bbeb96b3fabc3c7c2aa2abc717)
- [Next.js Error Handling v16.1.6](https://nextjs.org/docs/app/getting-started/error-handling) (Feb 2026)
- [Complete Guide to Next.js Error Boundary](https://eastondev.com/blog/en/posts/dev/20260106-nextjs-error-boundary-guide/) (Jan 2026)
- [GDPR Compliance Checklist for Next.js Apps](https://medium.com/@kidane10g/gdpr-compliance-checklist-for-next-js-apps-801c9ea75780) (Oct 2025)
- [Cookie Consent for Next.js - Termly](https://termly.io/resources/articles/cookie-consent-for-next-js/) (Jan 2026)
- [Cookie Compliance in 2026: GDPR Enforcement](https://www.gerrishlegal.com/blog/cookie-compliance-in-2026-where-gdpr-enforcement-stands-now) (Dec 2025)
- [React Cookie Consent: GDPR Implementation Guide for Next.js](https://www.cookietrust.io/react-nextjs-cookie-consent-gdpr-guide/) (Jan 2026)
- [Mastering Next.js Server Actions: Advanced Patterns](https://www.averagedevs.com/blog/nextjs-server-actions-mastery) (Feb 2026)
