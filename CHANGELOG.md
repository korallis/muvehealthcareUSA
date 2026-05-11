# Changelog

All notable changes to the Muve Healthcare site will be documented in this file.

## [1.2.0] - 2026-02-17

### Added

- Home button in admin portal sidebar with dashboard overview link (#97)
- End date & time fields for events, with smart same-day vs. multi-day display (#98)
- Fullscreen lightbox/carousel for news article photo galleries with keyboard navigation (#93)
- Multi-file gallery upload supporting batch selection of up to 50 images (#92)
- Recommended image dimension hints on news article upload forms (#92)
- Inline category creation dialogs across news, events, FAQ, and quicklinks forms (#94, #101, #102)

### Fixed

- Published articles not appearing in "Latest News" section — added status filter and fixed query ordering (#96)
- Data loss when creating a new category during news/event article creation — replaced page navigation with inline dialog (#94)
- FAQ category creation and selection failing after navigation (#101)
- Quicklink category creation and selection failing after navigation (#102)
- Event start time not displaying on the frontend event detail page (#99)
- Image preview shape mismatch between admin backend (rectangle) and frontend (circle) for events (#100)
- News article detail page layout breaking on mobile and tablet viewports (#95)

## [Unreleased]

## [1.1.0] - 2026-02-16

### Fixed

- Image uploads intermittently failing with generic "Failed to upload image" error
  - Restricted file picker to JPEG, PNG, GIF, WebP (was allowing unsupported formats like HEIC)
  - Surface actual server validation errors instead of generic message
  - Fixed `authGuard` catching redirect errors inside try-catch block
- Empty category dropdown on vacancy create page

### Changed

- Eliminated all ~30 explicit `any` types across 27 files for full TypeScript strict mode compliance
- Merged duplicate `newsArticles` relations in DB schema (Drizzle only uses the last `relations()` call, so `category` was missing from query type inference)
- Typed all server actions with proper interfaces instead of `any` parameters
- Typed Puck editor config components with proper prop interfaces
- Replaced `isomorphic-dompurify` with `sanitize-html` for Vercel compatibility

## [1.0.0] - 2026-02-10

### Added

- Security hardening: implemented all 23 PRD requirements across 4 phases
- Admin invite system with email invitations via Resend
- Microsoft Graph email integration
- Puck visual page editor with drag-and-drop components
- News articles with categories, gallery images, and rich text editor
- Job vacancies with category management
- Events management with featured images
- Impact stories section
- FAQ system with categories
- Resources/downloads section
- Builder.io integration for flexible page content
- Auth system with JWT, rate limiting, and role-based access
- Vercel Blob storage for image uploads with magic byte validation
- Upstash Redis for rate limiting and caching

### Fixed

- Production image upload 401 errors
- Production 500 errors from isomorphic-dompurify
- 25 review findings from code review agents and CodeRabbit
- Font loading issues
- Build errors across multiple deployments
