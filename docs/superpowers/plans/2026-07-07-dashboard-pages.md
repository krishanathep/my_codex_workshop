# LTR Dashboard Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the next set of high-value pages that the current visa workflow data already implies, so the app feels like a real case-management product instead of only two dashboards.

**Architecture:** Keep the existing dashboard pages and context as the source of truth, then introduce dedicated route pages for request detail, applicant request history, document follow-up, and admin work queues. Each page should read from the existing `VisaRequestsProvider` rather than duplicating state, so the new screens stay in sync with the current mock/localStorage-backed data model.

**Tech Stack:** React 18, TypeScript, React Router v6, MUI v6, existing `VisaRequestsProvider`, existing mock/localStorage persistence.

## Global Constraints

- Do not replace the current dashboard experience; new pages must complement `AdminDashboard` and `UserDashboard`.
- Keep the current data model in `src/data/mockData.ts` as the source of truth unless a new field is required by a page.
- Reuse the existing MUI theme and visual language from `src/App.tsx`.
- Avoid adding a backend or API layer in this iteration.
- Keep all new data interactions client-side and compatible with the current `localStorage` persistence.

---

### Task 1: Map the missing product surfaces and lock page scope

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/pages/AdminDashboard.tsx`
- Modify: `src/pages/UserDashboard.tsx`
- Modify: `src/data/mockData.ts`

**Interfaces:**
- Consumes: `VisaRequest`, `RequestStatus`, `DocumentStatus`
- Produces: route-level placeholders for the new pages and a locked page list for the implementation tasks

- [ ] **Step 1: Confirm the page list we are building**

Use the current data model to commit to these pages:
- `Request Detail` page for one visa request
- `My Applications` page for user-side request history
- `Document Center` page for document follow-up and upload status
- `Admin Queue` page for operational triage
- `Analytics` page for higher-level reporting

- [ ] **Step 2: Define which data each page must show**

Use the existing fields already present in `VisaRequest`:
- `id`, `applicantName`, `email`, `nationality`, `visaType`
- `submittedDate`, `currentStatus`, `documentStatus`
- `assignedOfficer`, `expectedCompletionDate`
- `adminComment`, `documents`

- [ ] **Step 3: Lock the route names**

Use these route names for the new pages:
- `/applications`
- `/requests/:requestId`
- `/documents`
- `/admin/queue`
- `/admin/analytics`

- [ ] **Step 4: Decide what stays in the dashboards**

Keep the current dashboards as overview screens only:
- `AdminDashboard` remains the summary + table landing page
- `UserDashboard` remains the single-applicant demo view until the history page is added

---

### Task 2: Add request detail navigation and a full-case detail page

**Files:**
- Create: `src/pages/RequestDetailPage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/pages/AdminDashboard.tsx`
- Modify: `src/components/RequestDetailModal.tsx`
- Modify: `src/context/VisaRequestContext.tsx` if lookup helpers are needed

**Interfaces:**
- Consumes: `useVisaRequests()`, `requestId` route param, `VisaRequest`
- Produces: a reusable full-page detail view for a single request

- [ ] **Step 1: Define the page contract**

The page should display:
- request identity and applicant metadata
- current status and document status
- document checklist
- admin comment
- officer assignment and expected completion
- a compact timeline or progress strip if it can be derived from existing statuses

- [ ] **Step 2: Add navigation from existing surfaces**

Clicking a table row action or a modal action should open the request detail page.

- [ ] **Step 3: Reuse existing detail content**

Keep the modal behavior available, but make the full-page version the richer experience. The modal should stay as a quick preview, not a duplicate of the full page.

- [ ] **Step 4: Make the empty/not-found state explicit**

If a `requestId` does not exist, the page should show a calm not-found state with a route back to the dashboard.

---

### Task 3: Build a user-side application history page

**Files:**
- Create: `src/pages/MyApplicationsPage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/context/VisaRequestContext.tsx`
- Modify: `src/pages/UserDashboard.tsx`

**Interfaces:**
- Consumes: `requests` from `useVisaRequests()`
- Produces: a page that lists all applications available to the current demo user

- [ ] **Step 1: Decide the user identity model for the demo**

For now, use the current demo data as one user’s history rather than introducing auth.

- [ ] **Step 2: Define the list content**

Show:
- request ID
- visa type
- submitted date
- current status
- expected completion date
- action to open request detail

- [ ] **Step 3: Add search and status filtering**

Keep the filtering simple and aligned with the existing admin table logic.

- [ ] **Step 4: Add a clear empty state**

If there are no records, show a friendly empty state with a call to action that routes back to the application form.

---

### Task 4: Build a document follow-up page

**Files:**
- Create: `src/pages/DocumentCenterPage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/context/VisaRequestContext.tsx`

**Interfaces:**
- Consumes: request document arrays, document statuses
- Produces: a document-focused page with follow-up actions and clear status cues

- [ ] **Step 1: Group data by document readiness**

Show buckets such as:
- complete
- pending review
- missing documents

- [ ] **Step 2: Display documents per request**

Each row or card should show:
- request ID
- applicant name
- number of documents complete vs missing
- a shortcut to the request detail page

- [ ] **Step 3: Make upload intent obvious**

Even without a backend upload, present the page as the place where document follow-up happens.

- [ ] **Step 4: Keep the language honest**

Do not imply file persistence or server processing that does not exist yet.

---

### Task 5: Add admin queue and analytics pages

**Files:**
- Create: `src/pages/AdminQueuePage.tsx`
- Create: `src/pages/AdminAnalyticsPage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/pages/AdminDashboard.tsx`

**Interfaces:**
- Consumes: `requests` from `useVisaRequests()`, existing status aggregation logic
- Produces: an operations queue and a dedicated reporting page

- [ ] **Step 1: Define the admin queue focus**

The queue should emphasize:
- new submissions
- requests waiting for documents
- requests due soon
- requests assigned to officers

- [ ] **Step 2: Define the analytics focus**

The analytics page should show:
- request counts by status
- approval rate
- pending review count
- document completeness ratio
- workload by officer if the data supports it

- [ ] **Step 3: Keep the visuals derived from real data**

Any chart should be computed from the request array, not fixed demo numbers.

- [ ] **Step 4: Keep the current dashboard charts as the overview**

Move deeper reporting to the new analytics page, but preserve the existing summary cards in `AdminDashboard`.

---

### Task 6: Wire navigation and page entry points

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/pages/AdminDashboard.tsx`
- Modify: `src/pages/UserDashboard.tsx`
- Modify: `src/components/RequestDetailModal.tsx`

**Interfaces:**
- Consumes: route handlers and request IDs
- Produces: usable navigation between the existing dashboards and the new pages

- [ ] **Step 1: Update top-level routes**

Add routes for every new page without removing the existing `/admin` and `/user` routes.

- [ ] **Step 2: Add obvious entry buttons**

Put clear CTAs in the dashboards so the new pages are discoverable from the first screen.

- [ ] **Step 3: Ensure the modal and page flows do not conflict**

The modal should remain for quick inspection, while the dedicated detail page is used for deeper review.

- [ ] **Step 4: Verify 404/unmatched route behavior**

Unknown routes should still fall back to a useful dashboard destination.

---

### Task 7: Verify the new pages against the current data model

**Files:**
- Modify: `package.json` if any test script needs updating
- Add or modify tests only if the repo already has a test harness available

**Interfaces:**
- Consumes: the route tree and shared context
- Produces: a checked implementation that still builds and renders with the current data

- [ ] **Step 1: Build the app**

Run: `npm run build`

Expected: TypeScript and Vite build succeed with no route or import errors.

- [ ] **Step 2: Smoke-check the navigation**

Open the app and verify:
- admin dashboard still loads
- user dashboard still loads
- request detail page resolves
- new pages are reachable from the dashboards

- [ ] **Step 3: Check the empty state paths**

Confirm the UI handles:
- zero search results
- unknown request IDs
- empty request arrays if localStorage is cleared

- [ ] **Step 4: Commit the finished page set**

Create a commit after all routes and pages are wired and verified.
