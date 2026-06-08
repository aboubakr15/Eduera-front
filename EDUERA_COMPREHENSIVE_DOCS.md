# EDUera — AI-Powered University Management & Learning Platform (LMS)

> **Repository**: `/home/qassem/Desktop/eduera`  
> **Frontend**: React 19 (Create React App)  
> **Backend**: Django REST Framework (hosted externally on Railway)  
> **Last Updated**: June 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture & Project Structure](#3-architecture--project-structure)
4. [Public Landing Pages](#4-public-landing-pages)
5. [Authentication System](#5-authentication-system)
6. [Role-Based Dashboards & Features](#6-role-based-dashboards--features)
   - 6.1 [Admin Dashboard & Management Features](#61-admin-dashboard--management-features)
   - 6.2 [Student Dashboard & Features](#62-student-dashboard--features)
   - 6.3 [Instructor Dashboard & Features](#63-instructor-dashboard--features)
   - 6.4 [TA Dashboard](#64-ta-dashboard)
7. [AI Features (ChatBot, Quiz Generator, Presentation Generator)](#7-ai-features)
8. [API Layer (Frontend Services)](#8-api-layer)
9. [Backend API Specification (Django REST)](#9-backend-api-specification)
10. [AI API Specification](#10-ai-api-specification)
11. [Missing Backend Endpoints (Chatbot Persistence)](#11-missing-backend-endpoints)
12. [Routing & Navigation](#12-routing--navigation)
13. [State Management](#13-state-management)
14. [Styling & UI/UX](#14-styling--uiux)
15. [Current Status, Gaps & Observations](#15-current-status-gaps--observations)

---

## 1. Project Overview

**EDUera** is a comprehensive **AI-Powered University Management and Learning Management System (LMS)**. It provides a unified digital platform for university administration, instructors, teaching assistants, and students. The platform features:

- **Role-based portals** for Admin, Student, Instructor (Professor), and TA
- **Course management** (CRUD, scheduling, offerings, enrollments)
- **Academic content delivery** (materials, assignments, submissions, grading)
- **Communication tools** (announcements, course-based chat, notifications)
- **AI-powered features**: RAG-based academic chatbot, quiz generator, presentation (slides) generator, rubric-driven auto-grading
- **Real-time UI** with animated landing page, live clocks, calendar, notifications, dashboards with stat cards and charts

The project is **frontend-only in this repository**. The backend is a separate Django REST Framework application deployed on Railway at `https://graduation-project-production-be44.up.railway.app` (production) and `https://backend-copy-production-fef9.up.railway.app` (the proxy target).

---

## 2. Tech Stack

### Frontend

| Technology | Version | Usage |
|---|---|---|
| **React** | ^19.2.4 | UI library |
| **react-dom** | ^19.2.4 | DOM rendering |
| **react-router-dom** | ^7.13.0 | Client-side routing |
| **react-scripts (CRA)** | 5.0.1 | Build tooling (Create React App) |
| **Tailwind CSS** | ^3.4.17 | Utility-first CSS framework |
| **PostCSS** | ^8.4.31 | CSS preprocessing (with autoprefixer) |
| **react-icons** | ^5.5.0 | Icon library (FontAwesome, Material Icons, etc.) |
| **lucide-react** | ^0.564.0 | Lightweight icon library |
| **react-markdown** | ^10.1.0 | Markdown rendering |
| **remark-gfm** | ^4.0.1 | GitHub-flavored markdown for react-markdown |

### Backend (External)

| Technology | Details |
|---|---|
| **Django REST Framework** | RESTful API |
| **PostgreSQL** | Primary database |
| **JWT Authentication** | `access` + `refresh` tokens (via `simplejwt`) |
| **Groq Cloud (Llama 3.3 70B)** | AI/LLM engine for chatbot, RAG, grading |
| **FAISS / ChromaDB** | Vector search for RAG-powered answers from course materials |
| **Railway** | Cloud hosting/deployment |

---

## 3. Architecture & Project Structure

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    EDUera Frontend                        │
│              (React 19 + CRA + Tailwind)                  │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Public   │  │  Admin   │  │ Student  │  │Instructor│ │
│  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  │ │
│  │  (Home,  │  │(Dashboard│  │(Courses, │  │(Materials│ │
│  │  Login)  │  │ Courses, │  │Grades,   │  │Subm.,Grd)│ │
│  │          │  │ Students,│  │Chat,     │  │Chat,     │ │
│  │          │  │ ChatBot) │  │ChatBot)  │  │ChatBot)  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
│       └──────────────┼─────────────┼──────────────┘       │
│                      │             │                      │
│              ┌───────▼─────────────▼───────────┐          │
│              │    Custom API Client (axios.js)  │          │
│              │  - JWT auto-attach + auto-refresh│          │
│              │  - Request queue on 401          │          │
│              └────────────────┬─────────────────┘          │
└───────────────────────────────┼────────────────────────────┘
                                │ HTTPS / JSON
┌───────────────────────────────┼────────────────────────────┐
│              ▼               ▼                              │
│         Backend API (Django REST on Railway)                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│  │  Auth    │ │  Admin   │ │ Student  │ │  Instructor  │ │
│  │  App    │ │  App     │ │  App     │ │  App         │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘ │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  AI Services (Groq Cloud, Llama 3.3 70B, RAG)       │ │
│  │  Vector Database (FAISS/ChromaDB)                    │ │
│  └──────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  PostgreSQL Database                                  │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
eduera/
├── public/
│   ├── index.html            # HTML entry (<title>EDUera</title>)
│   ├── manifest.json         # PWA manifest
│   └── robots.txt            # Search engine crawling rules
│
├── build/                    # Production build artifacts
│   ├── static/css/           # Minified CSS bundles
│   ├── static/js/            # Minified JS bundles
│   └── index.html            # Built HTML output
│
├── src/
│   ├── api/                  # HTTP client & API service modules
│   │   ├── axios.js          # Custom fetch wrapper (JWT, auto-refresh, queue)
│   │   ├── adminApi.js       # Admin API endpoints (~19 methods)
│   │   ├── studentApi.js     # Student API endpoints (~26 methods)
│   │   └── instructorApi.js  # Instructor/TA API endpoints (~26 methods)
│   │
│   ├── assets/images/        # Static images (14 assets)
│   │   ├── bot.png, botImg.png      # Chatbot avatar variants
│   │   ├── man.png, stu.png         # User avatars
│   │   ├── instructor.png           # Instructor illustration
│   │   ├── login.jpg, campus.jpg    # Background/hero images
│   │   ├── graduate.jpg             # Graduation image
│   │   ├── community.png            # Community section image
│   │   ├── camp.jpg                 # Campus life image
│   │   ├── cs.jpg, is.jpg,          # Department images
│   │   │   it.jpg, sw.jpg           #   (CS, IS, IT, SW)
│   │   └── logo (from /public)      # EDUera branding
│   │
│   ├── components/
│   │   ├── Home/
│   │   │   ├── Hero.js              # Landing hero (mouse parallax, animated)
│   │   │   ├── Stats.js             # Animated counters, dept cards, campus
│   │   │   ├── Testimonials.js      # Infinite marquee carousel
│   │   │   └── Contact.js           # Contact form + social links
│   │   ├── Navbar.js          # Public navbar (logo, nav links, lang toggle, login)
│   │   ├── Topbar.js          # Dashboard topbar (breadcrumb, search, notifications, user)
│   │   ├── Footer.js          # Public footer (links, social, copyright)
│   │   └── sidebars/
│   │       ├── AdminSidebar.js      # 9 nav items (Overview, Management, bottom)
│   │       ├── StudentSidebar.js    # 9 nav items (Overview, Academics, Comm.)
│   │       ├── InstructorSidebar.js # 11 nav items (Overview, Management, bottom)
│   │       └── ChatSidebar.js       # EMPTY (placeholder)
│   │
│   ├── context/
│   │   ├── AuthContext.js     # JWT decode, login/logout, role extraction
│   │   └── ThemeContext.js    # Dark mode toggle via "dark" class on <html>
│   │
│   ├── layouts/
│   │   ├── MainLayout.js      # Public layout (Navbar + Footer + Outlet)
│   │   ├── AdminLayout.js     # Admin shell: AdminSidebar + Topbar + Outlet
│   │   ├── StudentLayout.js   # Student shell: StudentSidebar + Topbar + Outlet
│   │   └── InstructorLayout.js# Instructor/TA shell: InstructorSidebar + Topbar + Outlet
│   │
│   ├── pages/
│   │   ├── Home.js            # Landing page composition
│   │   ├── Login.js           # Email/password form, validation, role-based redirect
│   │   ├── admin/
│   │   │   ├── Dashboard.js       # Stat cards, donut charts, calendar, clock
│   │   │   ├── Courses.js         # CRUD table (search, filter, pagination, modals)
│   │   │   ├── CourseOfferings.js # CRUD with semester/year filters, schedule
│   │   │   ├── Departments.js     # Mock CRUD (CS, AI, IS, IT, SE)
│   │   │   ├── Students.js        # Student list (search, dept filter, pagination)
│   │   │   ├── Instructors.js     # CRUD (search, dept filter, title selection)
│   │   │   ├── TA.js              # CRUD (search, dept filter)
│   │   │   ├── ChatBot.js         # AI chatbot + Quiz + Presentation Generator (1207 lines)
│   │   │   ├── Account.js         # Profile editing, avatar, password change
│   │   │   ├── UploadCenter.js    # File upload + presentation generator
│   │   │   └── Settings.js        # EMPTY placeholder
│   │   ├── student/
│   │   │   ├── Dashboard.js       # Stat cards, course progress, announcements (615 lines)
│   │   │   ├── Courses.js         # Course listing (search, semester/status filters)
│   │   │   ├── CourseDetails.js   # Course info, materials, assignments, announcements
│   │   │   ├── Enrollments.js     # Enrollment list with status
│   │   │   ├── Assignments.js     # Assignment list + file submission modal
│   │   │   ├── Grades.js          # Grade list, letter grades, summary stats
│   │   │   ├── Todo.js            # Full CRUD to-do list (priority, due dates)
│   │   │   ├── ChatBot.js         # AI chatbot + Quiz + Presentation (1428 lines)
│   │   │   ├── Chat.js            # Course-based messaging with instructors
│   │   │   ├── Notifications.js   # Notifications list
│   │   │   └── Profile.js         # Profile editing + password change
│   │   ├── instructor/
│   │   │   ├── Dashboard.js       # Stat cards, course overview, announcements (418 lines)
│   │   │   ├── Courses.js         # Course management (CRUD)
│   │   │   ├── CourseDetails.js   # Course detail view
│   │   │   ├── Materials.js       # Course materials CRUD
│   │   │   ├── Assignments.js     # Assignment management (CRUD)
│   │   │   ├── Submissions.js     # Submissions list + grading
│   │   │   ├── Students.js        # Student list per course
│   │   │   ├── Announcements.js   # Announcement CRUD
│   │   │   ├── Chat.js            # Course-based messaging with students
│   │   │   ├── ChatBot.js         # AI chatbot + Quiz + Presentation (1279 lines)
│   │   │   ├── UploadCenter.js    # Presentation generator
│   │   │   ├── Account.js         # Profile editing
│   │   │   └── Notifications.js   # Notifications list
│   │   └── ta/
│   │       └── Dashboard.js       # EMPTY (0 lines)
│   │
│   ├── routes/
│   │   ├── router.jsx         # Full route table (35+ routes)
│   │   └── ProtectedRoute.js  # Role-based route guard
│   │
│   ├── App.js                 # Root: AuthProvider wraps RouterProvider
│   └── index.js               # Entry: renders App inside ThemeProvider
│
├── API_DOCS.md                # Full REST API documentation
├── API_AI_DOCS.md             # AI-specific API endpoints
├── BACKEND_CHATBOT_REQUIREMENTS.md  # Missing chatbot endpoints
├── package.json               # Project config, dependencies, scripts
├── tailwind.config.js         # Custom Tailwind theme
├── postcss.config.js          # PostCSS config
└── README.md                  # Project README
```

---

## 4. Public Landing Pages

### 4.1 Home Page (`/`)

The landing page is composed of the following sections, orchestrated in `src/pages/Home.js`:

#### Hero (`src/components/Home/Hero.js`)
- Full-screen hero with a **campus background image**
- **Mouse parallax effect**: the background shifts based on cursor position
- CSS keyframe animations for fade-in and slide-up of text elements
- CTA button: "Start your journey"
- Overlay: `#1B2036/65` for readability

#### Stats & About (`src/components/Home/Stats.js`)
- Animated **counting-up numbers** (uses IntersectionObserver to trigger on scroll)
  - "+500 Professor and TA"
  - "+10,000 Students"
  - "+120 Courses"
  - "24/7 Available"
- "Why EDUera?" section with left image / right text layout
- **Department cards** (Software Engineering, Computer Science, Internet Technology, Information Systems) with hover-reveal descriptions
- "Campus Life" full-bleed image section with overlay text

#### Testimonials (`src/components/Home/Testimonials.js`)
- **Infinite marquee carousel** (CSS `marquee` animation, pauses on hover)
- 3 testimonials duplicated for seamless loop
- Gradient fade edges on left/right
- Quote icons, avatars, names, and roles

#### Contact (`src/components/Home/Contact.js`)
- Contact form (name, email, message fields) + community image
- Social media links (Facebook, Instagram, Mail)

#### Navbar (`src/components/Navbar.js`)
- Fixed top navigation
- Logo + "EDUera" branding
- Nav links: Home, About Us, Contact Us, Community
- Language toggle (English - UI only, no actual i18n)
- Login button → navigates to `/login`

#### Footer (`src/components/Footer.js`)
- Logo + description
- Quick Links, Legal Links, Contact info
- Social media icons
- Copyright notice

### 4.2 Login Page (`/login`)

- Two-column layout: form (left) / decorative image (right)
- Email + password inputs with show/hide toggle
- "Remember me" checkbox, "Forgot password?" link
- Form validation: shows error messages (red alert box)
- Loading spinner on submit
- On success: decodes JWT, extracts `primary_role`, navigates to appropriate dashboard:
  - `ADMIN` → `/admin/dashboard`
  - `STUDENT` → `/student/dashboard`
  - `PROFESSOR` → `/instructor/dashboard`
  - `TA` → `/ta/dashboard`
- Back button to return to home page

---

## 5. Authentication System

### AuthContext (`src/context/AuthContext.js`)

The authentication system revolves around **JWT tokens** (access + refresh):

| Concept | Implementation |
|---|---|
| **Login** | `POST /api/token/` with email + password → receives `access` + `refresh` tokens |
| **Token Storage** | `localStorage` keys: `access_token`, `refresh_token`, `user_email` |
| **JWT Decoding** | Manual base64 decode of JWT payload (extracts `primary_role`, `user_id`) |
| **State** | `user` object, `userRole` string, `authTokens` pair |
| **Logout** | Clears localStorage + `POST /api/token/blacklist/` to invalidate refresh |
| **Loading** | `loading` state ensures child components wait for auth initialization |

### ProtectedRoute (`src/routes/ProtectedRoute.js`)

Role-based route guard with the following logic:

```javascript
if (no token) → redirect to /login
if (wrong role) → redirect to that role's dashboard
if (correct role) → render <Outlet />
```

Loading state returns `null` (blank) to prevent flash of login page.

---

## 6. Role-Based Dashboards & Features

### 6.1 Admin Dashboard & Management Features

**Base path**: `/admin/*`  
**Layout**: `AdminSidebar` + `Topbar` + content  
**Required role**: `ADMIN`

#### Dashboard (`/admin/dashboard`)
- 4 stat cards: Students, Instructors, TAs, Courses (clickable → navigate to management pages)
- **Gender distribution donut chart** (Male/Female percentages)
- **Department distribution donut chart** (CS, IS, IT, AI breakdown)
- **Announcements section** (inline add/view)
- **Calendar widget** (month navigation, date selection, today highlight)
- **Schedule/Events timeline** (Future Events with time, title, tag, audience)
- All values fetched from `GET /admin/dashboard/summary/`

#### Courses Management (`/admin/courses`)
- Full CRUD table with:
  - Search by name/code
  - Filter by department dropdown
  - Pagination (8 per page)
  - Multi-select checkboxes (per-page select all)
  - Edit (inline modal with name, code, credit hours, department fields)
  - Delete (confirmation modal with course name)
- Data: `GET /admin/courses/`, `POST /admin/courses/`, `PATCH /admin/courses/{id}/`, `DELETE /admin/courses/{id}/`

#### Course Offerings (`/admin/course-offerings`)
- CRUD with search, semester filter, year filter, active status filter
- Schedule data: day, time slots
- Associated instructor and TAs

#### Departments (`/admin/departments`)
- Mock data: Computer Science, Artificial Intelligence, Information System, Software Engineering
- Department CRUD (hardcoded departments, not fully connected to backend)

#### Students (`/admin/students`)
- Student list with search + department filter + pagination
- View-only (no create/edit for students directly)

#### Instructors (`/admin/instructors`)
- CRUD for professors: search, department filter, title selection
- Create: `POST /admin/users/instructors/`

#### Teaching Assistants (`/admin/tas`)
- CRUD for TAs: search, department filter
- Create: `POST /admin/users/tas/`

#### ChatBot (`/admin/chatbot`)
- AI chatbot (conversation sidebar + chat interface)
- **Quiz Generator**: drag-and-drop file upload, select number of questions (3-10), difficulty (Easy/Medium/Hard), generates quiz
- **Presentation Generator**: slide creation tool

#### Account (`/admin/account`)
- Profile editing (name, email, avatar upload)
- Password change form (current password → new password)

#### UploadCenter (`/admin/upload`)
- File upload interface
- Presentation generator tool

#### Settings (`/admin/settings`)
- **EMPTY** — placeholder page

#### Admin API Layer (`src/api/adminApi.js`)

| Method | Function | Endpoint |
|---|---|---|
| GET | getDashboardSummary | `/admin/dashboard/summary/` |
| GET | getCourses | `/admin/courses/` |
| POST | createCourse | `/admin/courses/` |
| PATCH | updateCourse | `/admin/courses/{id}/` |
| DELETE | deleteCourse | `/admin/courses/{id}/` |
| GET | getCourseOfferings | `/admin/course-offerings/` |
| POST | createCourseOffering | `/admin/course-offerings/` |
| PATCH | updateCourseOffering | `/admin/course-offerings/{id}/` |
| DELETE | deleteCourseOffering | `/admin/course-offerings/{id}/` |
| GET | getUsers | `/admin/users/` |
| POST | createInstructor | `/admin/users/instructors/` |
| POST | createTA | `/admin/users/tas/` |
| GET | getAnnouncements | `/admin/announcements/` |
| POST | createAnnouncement | `/admin/announcements/` |
| POST | uploadMaterial | `/admin/materials/upload/` |
| GET | getConversations | `/admin/chat/` |
| GET | getConversationMessages | `/admin/chat/messages/` |
| POST | sendChatMessage | `/admin/chat/` |
| POST | createConversation | `/admin/conversations/` |
| GET | getConversationDetails | `/admin/conversations/{id}/` |
| PATCH | updateConversation | `/admin/conversations/{id}/` |
| DELETE | deleteConversation | `/admin/conversations/{id}/` |
| GET | getProfile | `/admin/profile/` |
| PATCH | updateProfile | `/admin/profile/` |
| POST | changePassword | `/api/auth/change-password/` |
| GET | getNotifications | `/admin/notifications/` |
| GET | getSystemStats | `/admin/system-stats/` |

---

### 6.2 Student Dashboard & Features

**Base path**: `/student/*`  
**Layout**: `StudentSidebar` + `Topbar` + content  
**Required role**: `STUDENT`

#### Dashboard (`/student/dashboard`)
- Welcome banner with user name
- **AI Assistant promotional card** (gradient card with bot avatar, feature pills, CTA to chatbot)
- 4 stat cards: Enrolled Courses, Current GPA, Enrolled Hours, Completed Courses
- **Course Progress** list (name, code, progress bar)
- **Portal Announcements** (scrollable, from admin)
- **Course Announcements** (scrollable, per-course)
- Right sidebar:
  - User profile card (avatar, name, ID, department)
  - Streak counter + weekly streak chart (Mon–Sun)
  - Courses Status (In Progress vs Completed bar chart)
  - Motivational card with "My Courses" CTA

#### Courses (`/student/courses`)
- List of enrolled courses with search, semester filter, status filter
- Course cards with instructor, schedule, progress

#### Course Details (`/student/courses/:id`)
- Detailed course view: instructor info, schedule
- **Materials** section (downloadable files)
- **Assignments** section (with status: Pending/Submitted/Graded)
- **Course Announcements**

#### Enrollments (`/student/enrollments`)
- List of all enrollments (ACTIVE, COMPLETED, DROPPED)
- Filter by status
- Drop course functionality

#### Assignments (`/student/assignments`)
- Assignment list with course name, title, due date, points, status
- File submission modal (upload file)

#### Grades (`/student/grades`)
- Grade table: course name, code, grade, letter grade, status
- Summary stats: GPA, total credits, completed courses

#### Todo (`/student/todo`)
- Full CRUD to-do list:
  - Create: title, description, priority (LOW/MEDIUM/HIGH), due date
  - Edit: inline editing
  - Delete with confirmation
  - Mark as complete (checkbox)
  - Search

#### ChatBot (`/student/chatbot`)
- AI chatbot (conversation sidebar + chat interface)
- **Quiz Generator**: file upload → select num questions + difficulty → generate quiz
- **Presentation Generator**: create slides from topics
- Uses `ReactMarkdown` + `remark-gfm` for rich AI responses
- Calls: `POST /api/student/chat/`, `GET /api/student/conversations/`, etc.

#### Chat (`/student/chat`)
- Course-based human-to-human chat with instructors/TAs
- List of courses → select course → send messages

#### Notifications (`/student/notifications`)
- Notifications list with read/unread status
- Mark as read

#### Profile (`/student/profile`)
- Edit full name, email, upload profile picture
- Change password

#### Student API Layer (`src/api/studentApi.js`)

| Method | Function | Endpoint |
|---|---|---|
| GET | getDashboard | `/api/student/dashboard/` |
| GET | getCourses | `/api/student/courses/` |
| POST | enrollCourse | `/api/student/courses/` |
| GET | getCourseDetails | `/api/student/courses/{id}/` |
| GET | getEnrollments | `/api/student/enrollments/` |
| DELETE | dropEnrollment | `/api/student/enrollments/{id}/` |
| GET | getSubmissions | `/api/student/submissions/` |
| POST | submitAssignment | `/api/student/submissions/` |
| GET | getGrades | `/api/student/grades/` |
| GET | getTodo | `/api/student/todo/` |
| POST | createTodo | `/api/student/todo/` |
| POST | updateTodo | `/api/student/todo/{id}/` |
| DELETE | deleteTodo | `/api/student/todo/{id}/` |
| GET | getProfile | `/api/student/profile/` |
| PATCH | updateProfile | `/api/student/profile/` |
| GET | getChatHistory | `/api/student/chat/` |
| POST | sendChatMessage | `/api/student/chat/` |
| GET | getChatMessages | `/api/student/chat/messages/` |
| GET | getConversations | `/api/student/conversations/` |
| POST | createConversation | `/api/student/conversations/` |
| PATCH | updateConversation | `/api/student/conversations/{id}/` |
| DELETE | deleteConversation | `/api/student/conversations/{id}/` |
| GET | getAssignments | `/api/student/assignments/` |
| GET | getCourseChat | `/api/student/courses/{id}/chat/` |
| POST | sendCourseMessage | `/api/student/courses/{id}/chat/` |
| POST | generateQuiz | `/api/student/chat/generate-quiz/` |
| POST | generatePresentation | `/api/student/chat/generate-presentation/` |
| GET | getNotifications | `/api/student/notifications/` |
| PATCH | markNotificationRead | `/api/student/notifications/{id}/` |

---

### 6.3 Instructor Dashboard & Features

**Base path**: `/instructor/*`  
**Layout**: `InstructorSidebar` + `Topbar` + content  
**Required role**: `PROFESSOR`

#### Dashboard (`/instructor/dashboard`)
- Welcome banner ("Welcome, Dr. {name}")
- 4 stat cards: Total Courses, Total Students, Pending Submissions, Upcoming Assignments
- **My Courses** list (name, code, semester/year, enrolled/capacity)
- **My Announcements** section
- **Portal Announcements** (hardcoded mock data)
- Right sidebar:
  - Profile card (avatar, name, role, stats mini-grid)
  - Motivational card with illustration ("Ready to inspire others?")

#### Courses (`/instructor/courses`)
- Course list with management capabilities
- Create/edit/delete course offerings

#### Course Details (`/instructor/courses/:id`)
- Full course view with:
  - Materials tab (upload/manage files)
  - Assignments tab (create/manage)
  - Enrolled Students tab (with grades)
  - Course details (schedule, TAs, capacity)

#### Materials (`/instructor/materials`)
- CRUD for course materials:
  - Upload files (PDFs, PPTX, DOCX, images, video, etc.)
  - Edit title, description, visibility to students
  - Delete materials
  - Filter by course offering

#### Assignments (`/instructor/assignments`)
- CRUD for assignments:
  - Create: title, description, due date, total points, type (QUIZ/EXAM/PROJECT/REPORT), submission location (ONLINE/IN_UNIVERSITY)
  - Edit, delete
  - Filter by course offering
  - View submissions per assignment

#### Submissions (`/instructor/submissions`)
- List of student submissions with:
  - Student name, course, assignment title
  - Submission date, file URL
  - **Grading**: input grade (0-100), notes/feedback
  - Status: SUBMITTED → GRADED

#### Students (`/instructor/students`)
- List of students enrolled in instructor's courses
- Search, filter by course
- View student details, enrolled courses, grades

#### Announcements (`/instructor/announcements`)
- CRUD for course-specific announcements
- Create: title, content, course (optional global), expiry date
- `is_TODO` flag → auto-creates todo items for students

#### Chat (`/instructor/chat`)
- Course-based chat with students
- List conversations per course → view messages

#### ChatBot (`/instructor/chatbot`)
- AI chatbot (conversation sidebar + chat interface)
- **Quiz Generator**: file upload → select settings → generate
- **Presentation Generator**: create slides from course content

#### UploadCenter (`/instructor/upload`)
- File upload + presentation generator

#### Account (`/instructor/account`)
- Edit profile (name, email, avatar)
- Change password

#### Notifications (`/instructor/notifications`)
- Notifications list with filtering and mark-as-read

#### Instructor API Layer (`src/api/instructorApi.js`)

| Method | Function | Endpoint |
|---|---|---|
| GET | getDashboard | `/api/professor/dashboard/` |
| GET | getCourses | `/api/professor/courses/` |
| POST | createCourse | `/api/professor/courses/` |
| GET | getCourseDetails | `/api/professor/courses/{id}/` |
| PATCH | updateCourse | `/api/professor/courses/{id}/` |
| DELETE | deleteCourse | `/api/professor/courses/{id}/` |
| GET | getMaterials | `/api/professor/materials/` |
| POST | createMaterial | `/api/professor/materials/` |
| PATCH | updateMaterial | `/api/professor/materials/{id}/` |
| DELETE | deleteMaterial | `/api/professor/materials/{id}/` |
| GET | getAssignments | `/api/professor/assignments/` |
| POST | createAssignment | `/api/professor/assignments/` |
| GET | getAssignmentDetails | `/api/professor/assignments/{id}/` |
| PATCH | updateAssignment | `/api/professor/assignments/{id}/` |
| DELETE | deleteAssignment | `/api/professor/assignments/{id}/` |
| GET | getSubmissions | `/api/professor/submissions/` |
| POST | gradeSubmission | `/api/professor/submissions/{id}/grade/` |
| GET | getStudents | `/api/professor/students/` |
| GET | getAnnouncements | `/api/professor/announcements/` |
| POST | createAnnouncement | `/api/professor/announcements/` |
| PATCH | updateAnnouncement | `/api/professor/announcements/{id}/` |
| DELETE | deleteAnnouncement | `/api/professor/announcements/{id}/` |
| GET | getConversations | `/api/professor/chat/` |
| GET | getConversationMessages | `/api/professor/chat/messages/` |
| POST | sendChatMessage | `/api/professor/chat/` |
| GET | getOwnConversations | `/api/professor/conversations/` |
| POST | createConversation | `/api/professor/conversations/` |
| PATCH | updateConversation | `/api/professor/conversations/{id}/` |
| DELETE | deleteConversation | `/api/professor/conversations/{id}/` |
| GET | getCourseChat | `/api/professor/courses/{id}/chat/` |
| POST | sendCourseMessage | `/api/professor/courses/{id}/chat/` |
| POST | generateQuiz | `/api/professor/chat/generate-quiz/` |
| POST | generatePresentation | `/api/professor/chat/generate-presentation/` |
| GET | getProfile | `/api/professor/profile/` |
| PATCH | updateProfile | `/api/professor/profile/` |
| POST | changePassword | `/api/auth/change-password/` |
| GET | getNotifications | `/api/professor/notifications/` |
| PATCH | markNotificationRead | `/api/professor/notifications/{id}/` |

---

### 6.4 TA Dashboard

**Base path**: `/ta/*`  
**Layout**: `InstructorLayout` (reuses InstructorSidebar + Topbar)  
**Required role**: `TA`

TA routes mirror Instructor routes exactly (same components, same API endpoints via `/api/ta/`).

| Path | Component |
|---|---|
| `/ta/dashboard` | InstructorDashboard |
| `/ta/courses` | InstructorCourses |
| `/ta/courses/:id` | InstructorCourseDetails |
| `/ta/materials` | InstructorMaterials |
| `/ta/assignments` | InstructorAssignments |
| `/ta/submissions` | InstructorSubmissions |
| `/ta/students` | InstructorStudents |
| `/ta/announcements` | InstructorAnnouncements |
| `/ta/chat` | InstructorChat |
| `/ta/notifications` | InstructorNotifications |

**Note**: The TA `Dashboard.js` file at `src/pages/ta/Dashboard.js` is **empty (0 lines)**. The TA dashboard works because the router maps `/ta/dashboard` to the `InstructorDashboard` component from the instructor pages directory.

TA does **not** have access to: ChatBot, UploadCenter, Account settings.

---

## 7. AI Features

EDUera has three AI-powered subsystems, all accessible through the ChatBot pages:

### 7.1 AI Chatbot (RAG-Based)

- **Purpose**: Course-specific Q&A assistant using course materials as context
- **AI Engine**: Llama 3.3 70B via Groq Cloud
- **Temperature**: 0.1 (low variance for objective answers)
- **Max Tokens**: 2048 per evaluation
- **RAG Pipeline**: Vector Search (FAISS/ChromaDB) retrieves relevant document chunks → passed as context to LLM
- **Key behaviors**:
  - Answers based strictly on course materials (lectures, PDFs, PPTX, transcripts)
  - Returns `sources_used` with document titles and page numbers when from RAG
  - `was_from_rag` boolean field in response
  - Falls back to general knowledge if no relevant material found
- **Prompt security**: User inputs wrapped in XML tags (`<student_submission>`) to prevent prompt injection
- **Context retention**: Supports `conversation_id` for multi-turn conversations
- **File upload**: Students can upload PDFs/DOCX and ask questions about them

### 7.2 Quiz Generator

- **Trigger**: Via chatbot (keyword detection) or dedicated UI
- **Flow**:
  1. User uploads a file (PDF, DOCX, TXT) or specifies a course/topic
  2. Select number of questions (3-10) and difficulty (Easy/Medium/Hard)
  3. AI generates quiz based on file content
  4. Quiz is displayed directly in the chat interface
- **Implementation**: Each user role (admin, student, instructor) has its own QuizGenerator component within their ChatBot page with significant code duplication (see "Gaps" section)

### 7.3 Presentation (Slides) Generator

- **Trigger**: Keywords like "make a presentation", "create slides", "PowerPoint" in chat
- **Flow**:
  1. AI generates a Markdown outline (Blueprint Phase)
  2. User can give refinement feedback ("Add more about X", "Remove slide 3")
  3. Once approved, AI generates a `.pptx` file
  4. File path returned: `presentations/gen_123.pptx`
- Also accessible via **UploadCenter** pages for admin and instructor

### 7.4 AI Rubric-Driven Grading (Student Side)

- **Endpoint**: `POST /api/student/rubric-submit/`
- **Purpose**: Students submit text/code for instant AI evaluation against a rubric
- **Response**: `grading_result` with:
  - `total_score`, `max_score`, `percentage`
  - `criteria_breakdown` array: `criteria_name`, `points_awarded`, `max_points`, `justification`
  - `feedback_summary`

### 7.5 AI Rubric Management (Instructor Side)

- **Endpoint**: `POST /api/professor/rubric-assignments/`
- **Purpose**: Instructors configure how AI should grade for each assignment
- **Fields**:
  - `grading_type`: `SUBJECTIVE` (Text/Essay) or `OBJECTIVE` (Code/Execution)
  - `rubric`: array of `{criteria_name, max_points, description}`
  - `model_answer_text`: ground truth for comparison
- **Regrading**: `POST /api/professor/submissions/{id}/regrade/` — force AI to re-evaluate

---

## 8. API Layer

### Custom HTTP Client (`src/api/axios.js`)

Despite the name "axios.js", this is a **custom fetch-based HTTP client** (not the Axios library).

Key features:

| Feature | Implementation |
|---|---|
| **JWT Auto-Attach** | Reads `access_token` from localStorage, sets `Authorization: Bearer` header |
| **Auto-Refresh** | On 401 response: calls `POST /api/token/refresh/` with stored refresh_token |
| **Request Queue** | Multiple simultaneous 401s are queued; a single refresh call is made; all queued requests are retried with the new token |
| **Token Rotation** | Saves both new access and new refresh tokens on refresh |
| **Logout on Fail** | If refresh fails, clears tokens and redirects to `/login` |
| **Interceptors** | Request/response hooks (mimics Axios interceptor API) |
| **FormData Support** | Auto-detects `FormData` and avoids setting `Content-Type: application/json` |
| **Params Serialization** | Converts `options.params` object to URL query string |

### API Method Signatures

```javascript
api.get(url, options = {})       // GET request
api.post(url, data, options = {}) // POST request
api.patch(url, data, options = {}) // PATCH request
api.put(url, data, options = {})   // PUT request
api.delete(url, options = {})      // DELETE request
```

All methods return `{ status, data }` on success, or `Promise.reject({ response: { status, data } })` on error.

### Service Modules

Three service modules wrap the API client:

- **`adminApi.js`** — 19 methods targeting `/admin/*` endpoints
- **`studentApi.js`** — 26 methods targeting `/api/student/*` endpoints
- **`instructorApi.js`** — 26 methods targeting `/api/professor/*` endpoints (also used by TA via `/api/ta/*`)

---

## 9. Backend API Specification

The backend is a **Django REST Framework** application with the following structure:

### Authentication Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/token/` | Login → receives access + refresh tokens |
| POST | `/api/token/refresh/` | Refresh expired access token (rotates refresh token) |
| POST | `/api/token/blacklist/` | Logout (invalidates refresh token) |

- **Access Token TTL**: 60 minutes
- **Refresh Token TTL**: 1 day
- **Token Rotation**: Enabled — each refresh returns a new refresh token; old one is blacklisted

### Admin Endpoints (`/admin/*`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/dashboard/summary/` | Students, courses, doctors, TAs counts + gender distribution |
| GET/POST | `/admin/courses/` | List/Create courses (search by name/code, filter by dept) |
| PATCH/DELETE | `/admin/courses/{id}/` | Update/Delete course |
| GET/POST | `/admin/course-offerings/` | List/Create (filter by semester/year/active) |
| PATCH/DELETE | `/admin/course-offerings/{id}/` | Update/Delete offering |
| GET/POST | `/admin/enrollments/` | List/Create (filter by status/course/student) |
| PATCH/DELETE | `/admin/enrollments/{id}/` | Update/Delete enrollment |
| GET/POST | `/admin/departments/` | List/Create departments |
| PATCH/DELETE | `/admin/departments/{id}/` | Update/Delete department |
| GET | `/admin/users/` | List users (filter by role: STUDENT/TA/PROFESSOR) |
| POST | `/admin/users/instructors/` | Create instructor |
| POST | `/admin/users/tas/` | Create TA |
| GET/POST | `/admin/announcements/` | List/Create announcements |
| POST | `/admin/materials/upload/` | Upload course material |
| GET | `/admin/chat/` | List conversations |
| GET | `/admin/chat/messages/` | Get messages (query: conversation_id) |
| GET/PATCH | `/admin/notifications/` | List/Mark notifications |
| GET/PATCH | `/admin/profile/` | Get/Update profile |

### Student Endpoints (`/api/student/*`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/student/dashboard/` | Profile summary, announcements, course progress |
| GET/POST | `/api/student/courses/` | List enrolled courses / Enroll in course |
| GET | `/api/student/courses/{id}/` | Course details (materials, assignments) |
| GET | `/api/student/enrollments/` | List enrollments (filter by status) |
| DELETE | `/api/student/enrollments/{id}/` | Drop course |
| GET/POST | `/api/student/submissions/` | List/Submit assignments |
| GET | `/api/student/grades/` | Course grades |
| GET/POST | `/api/student/todo/` | List/Create todo items |
| POST/DELETE | `/api/student/todo/{id}/` | Update/Delete todo |
| GET/PATCH | `/api/student/profile/` | Get/Update profile |
| GET/POST | `/api/student/chat/` | Get chat history / Send message (RAG) |
| GET | `/api/student/chat/messages/` | Get messages by conversation_id |
| GET/POST | `/api/student/conversations/` | List/Create conversations |
| PATCH/DELETE | `/api/student/conversations/{id}/` | Update/Delete conversation |
| GET/POST | `/api/student/courses/{id}/chat/` | Course-based messaging |
| POST | `/api/student/chat/generate-quiz/` | Generate quiz via AI |
| POST | `/api/student/chat/generate-presentation/` | Generate slides via AI |
| GET/PATCH | `/api/student/notifications/` | List/Mark notifications |

### Instructor/Professor Endpoints (`/api/professor/*`, `/api/instructor/*`)

Both `/api/professor/` and `/api/ta/` route to the same shared Instructor app.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/instructor/dashboard/` | Courses, students, pending submissions, announcements |
| GET/POST | `/api/instructor/courses/` | List/Create course offerings |
| GET/PATCH/DELETE | `/api/instructor/courses/{id}/` | Course details, update, delete |
| GET/POST | `/api/instructor/materials/` | List/Upload (multipart, single or bulk) |
| PATCH/DELETE | `/api/instructor/materials/{id}/` | Update/Delete material |
| GET | `/api/instructor/materials/{id}/download/` | Download file (streams binary) |
| GET/POST | `/api/instructor/assignments/` | List/Create assignments |
| GET/PATCH/DELETE | `/api/instructor/assignments/{id}/` | Assignment CRUD |
| GET | `/api/instructor/submissions/` | List submissions (filter by assignment/course) |
| POST | `/api/instructor/submissions/{id}/grade/` | Grade submission |
| GET | `/api/instructor/students/` | List students (filter by course) |
| GET/POST | `/api/instructor/announcements/` | List/Create announcements |
| PATCH/DELETE | `/api/instructor/announcements/{id}/` | Manage announcement |
| GET | `/api/instructor/chat/` | List conversations (student chats) |
| GET | `/api/instructor/chat/messages/` | Get messages (query: conversation_id) |
| GET/POST | `/api/instructor/notifications/` | List/Mark notifications |
| POST | `/api/instructor/submissions/{id}/regrade/` | Trigger AI re-grading |

### Material Upload Rules

| File Type | Extensions | Max Size |
|---|---|---|
| Documents | pdf, pptx, ppt, docx, doc, xlsx, xls | 100 MB |
| Plain Text | txt | 10 MB |
| Images | png, jpg, jpeg, gif | 20 MB |
| Archives | zip | 500 MB |
| Audio | mp3 | 200 MB |
| Video | mp4 | 2 GB |

**Bulk Upload**: Multiple files can be uploaded in a single request (all `file` fields). Atomic validation — if any single file fails, the entire transaction is rolled back.

**Side Effects**: Uploading a visible material automatically creates `MATERIAL_UPLOAD` notifications for all enrolled students.

---

## 10. AI API Specification

Detailed in `API_AI_DOCS.md`:

### RAG Chat (`POST /api/student/chat/`)

- **Engine**: Groq Cloud Llama 3.3 70B
- **Temperature**: 0.1
- **Security**: Input sanitized inside `<student_submission>` XML tags
- **Response**: `{ conversation_id, ai_message: { content, sources_used, was_from_rag } }`

### Presentation Generator

- Integrated in chat; triggered by keywords
- Blueprint → Refinement → `.pptx` generation
- Returns `presentation_path` in response

### Rubric-Driven Grading

- **Student**: `POST /api/student/rubric-submit/` → AI evaluates against rubric
- **Instructor**: `POST /api/professor/rubric-assignments/` → Configure rubric and model answer
- **Regrading**: `POST /api/professor/submissions/{id}/regrade/`

---

## 11. Missing Backend Endpoints (Chatbot Persistence)

The file `BACKEND_CHATBOT_REQUIREMENTS.md` documents endpoints that the frontend needs but the backend has not yet implemented:

### Needed for Student

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/student/conversations/` | List ALL conversations (currently returns only most recent) |
| GET | `/api/student/chat/messages/?conversation_id=X` | Get messages by conversation ID |
| POST | `/api/student/conversations/` | Create new conversation |
| DELETE | `/api/student/conversations/{id}/` | Delete conversation |

### Needed for Instructor/Professor

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/professor/chat/` | Send message to own AI assistant (entirely missing) |
| GET | `/api/professor/conversations/` | List own AI conversations |
| GET | `/api/professor/chat/messages/?conversation_id=X` | Get own AI messages |
| POST | `/api/professor/conversations/` | Create own AI conversation |
| DELETE | `/api/professor/conversations/{id}/` | Delete own AI conversation |

### Priority

- **Phase 1 (Critical)**: `GET /api/student/conversations/`, `GET /api/student/chat/messages/`, `POST /api/professor/chat/`
- **Phase 2 (Important)**: Create/delete conversation endpoints, title update (PATCH)
- **Phase 3 (Nice to Have)**: Star/favorite, archive conversations

---

## 12. Routing & Navigation

### Complete Route Table

| Path | Component | Protected | Role |
|---|---|---|---|
| `/` | Home | No | Public |
| `/login` | Login | No | Public |
| `/admin` | AdminLayout (shell) | Yes | ADMIN |
| `/admin/dashboard` | Dashboard | Yes | ADMIN |
| `/admin/courses` | Courses | Yes | ADMIN |
| `/admin/course-offerings` | CourseOfferings | Yes | ADMIN |
| `/admin/departments` | Departments | Yes | ADMIN |
| `/admin/students` | Students | Yes | ADMIN |
| `/admin/instructors` | Instructors | Yes | ADMIN |
| `/admin/teaching-assistants` | TA | Yes | ADMIN |
| `/admin/chatbot` | ChatBot | Yes | ADMIN |
| `/admin/account` | Account | Yes | ADMIN |
| `/admin/uploadCenter` | UploadCenter | Yes | ADMIN |
| `/admin/settings` | Settings | Yes | ADMIN |
| `/student` | StudentLayout (shell) | Yes | STUDENT |
| `/student/dashboard` | StudentDashboard | Yes | STUDENT |
| `/student/courses` | StudentCourses | Yes | STUDENT |
| `/student/courses/:id` | StudentCourseDetails | Yes | STUDENT |
| `/student/enrollments` | StudentEnrollments | Yes | STUDENT |
| `/student/assignments` | StudentAssignments | Yes | STUDENT |
| `/student/grades` | StudentGrades | Yes | STUDENT |
| `/student/todo` | StudentTodo | Yes | STUDENT |
| `/student/chatbot` | StudentChatBot | Yes | STUDENT |
| `/student/chat` | StudentChat | Yes | STUDENT |
| `/student/notifications` | StudentNotifications | Yes | STUDENT |
| `/student/profile` | StudentProfile | Yes | STUDENT |
| `/instructor` | InstructorLayout (shell) | Yes | PROFESSOR |
| `/instructor/dashboard` | InstructorDashboard | Yes | PROFESSOR |
| `/instructor/courses` | InstructorCourses | Yes | PROFESSOR |
| `/instructor/courses/:id` | InstructorCourseDetails | Yes | PROFESSOR |
| `/instructor/materials` | InstructorMaterials | Yes | PROFESSOR |
| `/instructor/assignments` | InstructorAssignments | Yes | PROFESSOR |
| `/instructor/submissions` | InstructorSubmissions | Yes | PROFESSOR |
| `/instructor/students` | InstructorStudents | Yes | PROFESSOR |
| `/instructor/announcements` | InstructorAnnouncements | Yes | PROFESSOR |
| `/instructor/chat` | InstructorChat | Yes | PROFESSOR |
| `/instructor/chatbot` | InstructorChatBot | Yes | PROFESSOR |
| `/instructor/uploadcenter` | InstructorUploadCenter | Yes | PROFESSOR |
| `/instructor/account` | InstructorAccount | Yes | PROFESSOR |
| `/instructor/notifications` | InstructorNotifications | Yes | PROFESSOR |
| `/ta` | InstructorLayout (shell) | Yes | TA |
| `/ta/dashboard` | InstructorDashboard | Yes | TA |
| `/ta/courses` | InstructorCourses | Yes | TA |
| `/ta/courses/:id` | InstructorCourseDetails | Yes | TA |
| `/ta/materials` | InstructorMaterials | Yes | TA |
| `/ta/assignments` | InstructorAssignments | Yes | TA |
| `/ta/submissions` | InstructorSubmissions | Yes | TA |
| `/ta/students` | InstructorStudents | Yes | TA |
| `/ta/announcements` | InstructorAnnouncements | Yes | TA |
| `/ta/chat` | InstructorChat | Yes | TA |
| `/ta/notifications` | InstructorNotifications | Yes | TA |

### Layout Structure

```
MainLayout (public)
├── /
└── /login

AdminLayout (ADMIN)
└── /admin/*

StudentLayout (STUDENT)
└── /student/*

InstructorLayout (PROFESSOR)
└── /instructor/*

InstructorLayout (TA) - same layout reused
└── /ta/*
```

### Navigation Sidebars

All three sidebars share the same pattern:
- **Collapsible**: Toggle between `w-60` (expanded) and `w-16` (collapsed/icon-only)
- **Sections**: Overview, Management/Academics/Communication, Bottom
- **User dropdown**: Email, role, "My Profile" link, sign out
- **Active state**: Highlighted with `#D67A1E` accent color
- **Styling**: Dark background (`#1B2036`), white text, hover effects

#### AdminSidebar Items
- **Overview**: Dashboard
- **Management**: Students, Instructors, Teaching Assistants, Departments, Courses, Course Offerings, ChatBot, UploadCenter
- **Bottom**: Account, Sign Out

#### StudentSidebar Items
- **Overview**: Dashboard
- **Academics**: My Courses, Enrollments, Assignments, Grades, To-Do, ChatBot
- **Communication**: Chat (Notifications is commented out)
- **Bottom**: Profile, Sign Out

#### InstructorSidebar Items
- **Overview**: Dashboard
- **Management**: Courses, Materials, Assignments, Submissions, Students, Announcements, Chat, ChatBot, UploadCenter
- **Bottom**: Account, Sign Out

---

## 13. State Management

### AuthContext (`src/context/AuthContext.js`)

| State | Type | Description |
|---|---|---|
| `user` | object | `{ email, user_id, primary_role }` |
| `userRole` | string | `ADMIN`, `STUDENT`, `PROFESSOR`, `TA`, or null |
| `authTokens` | object | `{ access, refresh }` |
| `loading` | boolean | True until auth state is restored from localStorage |

| Method | Description |
|---|---|
| `loginUser(email, password)` | API login, stores tokens, decodes JWT, sets user/role |
| `logoutUser()` | API blacklist refresh token, clear all state and localStorage |

### ThemeContext (`src/context/ThemeContext.js`)

| State | Type | Description |
|---|---|---|
| `darkMode` | boolean | Dark mode enabled? |
| `toggleDark(val)` | function | Sets dark mode; adds/removes `dark` class on `<html>` |

### Component-Level State

Each page manages its own state locally with `useState` and `useEffect`:
- API responses stored inline
- Form state for modals
- Pagination, search, filter state
- Loading and error states per page

---

## 14. Styling & UI/UX

### Tailwind Configuration (`tailwind.config.js`)

| Category | Values |
|---|---|
| **Dark Mode** | `class`-based toggle |
| **Primary Color** | `#F48C06` (orange) |
| **Dark Color** | `#103741` (teal-dark) |
| **Secondary** | `#FFF9F0` (cream) |
| **Accent Purple** | `#5B5B98` |
| **Success/Error** | `#2D9CDB` / `#EB5757` |
| **Text Colors** | `#1F1F1F` (dark), `#FFFFFF` (light), `#696984` (gray) |
| **Fonts** | Inter (body), Poppins (headings) |
| **Backgrounds** | `hero-mesh` (radial gradients), `grid-pattern` (dot grid) |
| **Keyframes** | `shine` (skeleton shimmer), `float` (floating), `marquee` (infinite scroll) |
| **Animations** | `shine` (5s linear), `float` (8s ease-in-out), `marquee` (40s linear) |

### UI/UX Patterns

- **Glass morphism**: Backdrop blur on modals and cards
- **Hover effects**: Scale, shadow, translate transitions on cards and buttons
- **Gradient accents**: Buttons, cards, banners use gradient backgrounds
- **Custom scrollbars**: `.portal-scroll` class for thin, styled scrollbars
- **Responsive design**: Grid layouts adapt from mobile to desktop
- **Consistent spacing**: Rounded corners (xl, 2xl), shadows (sm, md), border styling
- **Loading states**: Spinners and skeleton-like indicators
- **Empty states**: Icons + text for no-data scenarios
- **Modal patterns**: Overlay backdrop blur, centered modals for forms, delete confirmations

---

## 15. Current Status, Gaps & Observations

### What's Working

- ✅ **Full public landing page** with animations, departments, testimonials, contact form
- ✅ **JWT authentication** with login, auto-refresh, queue on 401
- ✅ **Admin panel**: Dashboard stats, courses CRUD, course offerings, departments, users management, chatbot, upload center
- ✅ **Student portal**: Dashboard, courses, enrollments, assignments, grades, todo, chatbot, course chat, notifications, profile
- ✅ **Instructor portal**: Dashboard, courses, materials CRUD, assignments CRUD, submissions grading, students list, announcements, chatbot, upload center
- ✅ **AI Chatbot** with RAG, Quiz Generator, Presentation Generator
- ✅ **Three distinct sidebars** with collapsible navigation
- ✅ **Real-time UI elements**: Calendar, clock, animated counters, marquee testimonials
- ✅ **Comprehensive API documentation** (API_DOCS.md, API_AI_DOCS.md)

### Known Gaps & Observations

| # | Issue | Details |
|---|---|---|
| 1 | **TA Dashboard empty** | `src/pages/ta/Dashboard.js` is 0 lines. However, the router maps `/ta/dashboard` to the InstructorDashboard component, so it theoretically works. |
| 2 | **Admin Settings page empty** | `src/pages/admin/Settings.js` is a placeholder with no content. |
| 3 | **ChatSidebar empty** | `src/components/sidebars/ChatSidebar.js` is 0 lines — never used in any layout. |
| 4 | **Duplicate ChatBot code** | Three ChatBot pages (admin: 1207 lines, student: 1428 lines, instructor: 1279 lines) contain nearly identical code for QuizGenerator and PresentationGenerator. Massive opportunity for refactoring into shared components. |
| 5 | **No i18n/i10n** | Language toggle exists in Navbar but no actual internationalization implementation. |
| 6 | **No testing framework configured** | No test files exist despite `@testing-library/*` in dependencies. `npm test` would scan for files but find none. |
| 7 | **Missing backend chatbot endpoints** | The `BACKEND_CHATBOT_REQUIREMENTS.md` documents several critical missing endpoints (see Section 11). |
| 8 | **Frontend-only repo** | No backend code in this repository — all backend is on Railway. |
| 9 | **Static mock data** | Some pages use hardcoded mock data (instructor Portal Announcements, Departments page). |
| 10 | **No student UploadCenter** | Admin and Instructor have upload centers but students don't. |
| 11 | **Instructor/TA no Enrollment page** | Unlike students, instructors can't view course enrollments as a separate page. |
| 12 | **No student enrollment for instructors** | Instructors can't enroll students into courses directly (admin must do it). |
| 13 | **No dark mode implementation in pages** | ThemeContext exists and `dark` class is toggleable on `<html>`, but no page components actually consume the context or implement dark mode styling. |
| 14 | **MainLayout commented out** | Navbar and Footer are commented out in MainLayout, so public pages (Home, Login) include their own Navbar/Footer instead. |
| 15 | **Instructor notifications are hardcoded** | The instructor dashboard portal announcements are hardcoded HTML, not fetched from API. |
| 16 | **Some API endpoints may not exist** | Endpoints like `/api/student/assignments/`, `/api/auth/change-password/`, and `/admin/system-stats/` are called by the frontend but their existence on the backend is unverified from the docs. |

### Code Quality Observations

- **Naming inconsistency**: Some paths use camelCase (`uploadCenter`), others kebab-case (`course-offerings`, `teaching-assistants`)
- **Arabic comment in axios.js**: `// لو الداتا FormData مش هنحولها لـ JSON` — mixed language comment
- **State management**: No Redux, Zustand, or any global state beyond AuthContext/ThemeContext — all page state is local `useState`
- **Error handling**: Try/catch on API calls with error state, but error messages are often just logged to console
- **Code duplication**: High between ChatBot pages, sidebar patterns, stat cards, and layout structures

---

*This document provides a comprehensive overview of the EDUera project as of June 2026. The project is a fully-featured LMS with AI capabilities, spanning 35+ frontend route paths across 4 user roles, with an external Django REST backend handling all data persistence and AI processing.*
