# Phase 1: Non-Ecommerce Foundation
**Goal**: Establish the core user system, content management, and admin tools before adding sales complexity.

## 1. Global Authentication State
**Feature**: `useAuth` Hook
- [ ] Create `pb-frontend/hooks/useAuth.ts`.
- [ ] Implement `login(email, password)` function using `POST /api/token/`.
- [ ] Implement `register(data)` function using `POST /api/register/`.
- [ ] Implement `logout()` function (clear token).
- [ ] Implement `user` state (fetch from `GET /api/users/me/`).
- [ ] Wrap `App.tsx` or components with an `AuthProvider` (if using Context) or just use the hook in components.

## 2. Authentication UI Integration
**Feature**: Login & Signup Modals
- [ ] In `AuthModal.tsx`:
    - [ ] Replace `setTimeout` mocks with `useAuth().login` and `register`.
    - [ ] Handle error states (e.g., "Invalid credentials").
    - [ ] Close modal on success and update UI to show "Logged in" state.
- [ ] In `App.tsx`:
    - [ ] Show User Name/Avatar instead of "Login" button when authorized.
    - [ ] Hide `GeminiChat` references if any remain.

**Feature**: Admin Portal Access
- [ ] In `AdminLoginPage.tsx`:
    - [ ] Call `login` API.
    - [ ] Check if `user.is_staff` is true. If not, show "Unauthorized".
    - [ ] Redirect to `AdminDashboard` on success.

## 3. User Dashboard
**Feature**: Personal Data
- [ ] In `Dashboard.tsx`:
    - [ ] Fetch real profile data (Points, Tier, Savings) from `user.profile`.
    - [ ] Display real "Recent Orders" (initially empty or mock from API later).

## 4. Content Management System (CMS)
**Feature**: Dynamic Blog Posts
- [ ] In `App.tsx` (or new `BlogService`):
    - [ ] Fetch blogs from `GET /api/blogposts/`.
    - [ ] Pass real data to `BlogSection` and `BlogDetailPage`.
- [ ] In `AdminDashboard.tsx`:
    - [ ] specific "Create Blog" form should `POST` to API.

**Feature**: Dynamic Events
- [ ] Similar to Blogs, fetch from `GET /api/events/`.
- [ ] Pass data to `EventsSection`.

**Feature**: Dynamic Stories
- [ ] Fetch `Story` objects from API for the mobile-style stories component.

## 5. Visitor Forms (Admin Feature)
**Feature**: Backend Support
- [ ] Create `VisitorForm` model in `api/models.py` (fields: title, event_name, qr_code_link (generated)).
- [ ] Create `VisitorSubmission` model (fields: form, name, email, phone, timestamp).
- [ ] Create Serializers and Viewsets.
- [ ] Register in `api/urls.py` and `admin.py`.

**Feature**: Frontend Integration
- [ ] In `AdminDashboard.tsx` -> "Visitor Forms" tab:
    - [ ] Fetch forms list from API.
    - [ ] "Create New Form" should `POST` to backend.
    - [ ] Display submissions list for each form.
