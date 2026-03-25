# Task Manager — Front-End

Single-page application for the Task Manager, built with **React 19**, **TypeScript**, **Tailwind CSS 4**, and **Vite 8**. Ships as a **Progressive Web App (PWA)** with offline support.

---

## Tech Stack

| Layer       | Technology                              |
| ----------- | --------------------------------------- |
| Framework   | React 19                                |
| Language    | TypeScript 5.9                          |
| Styling     | Tailwind CSS 4 (Vite plugin)            |
| Bundler     | Vite 8                                  |
| Routing     | React Router 7                          |
| HTTP Client | Axios                                   |
| Calendar    | react-big-calendar + date-fns           |
| PWA         | vite-plugin-pwa (Workbox)               |

---

## Project Structure

```
front-end/
├── public/                        # Static assets (PWA icons, favicon)
├── scripts/
│   └── generate-icons.cjs         # PWA icon generation script
├── src/
│   ├── main.tsx                   # Entry point + deferred SW registration
│   ├── App.tsx                    # Router & auth provider setup
│   ├── index.css                  # Global styles
│   ├── api/
│   │   ├── axios.ts              # Axios instance with JWT interceptors
│   │   └── api.ts                # Alternate API helper
│   ├── components/
│   │   ├── CalendarWidget.tsx     # react-big-calendar wrapper (lazy-loaded)
│   │   ├── ConfirmModal.tsx       # Reusable confirmation dialog
│   │   ├── CreateTaskModal.tsx    # New-task form modal
│   │   ├── InstallButton.tsx      # PWA install prompt button
│   │   ├── Navbar.tsx             # Top navigation bar
│   │   ├── OfflineBanner.tsx      # Offline status indicator
│   │   ├── ProtectedRoute.tsx     # Auth guard for routes
│   │   ├── TagBadge.tsx           # Colored tag chip
│   │   ├── TaskCard.tsx           # Task list item card
│   │   └── TaskDetailModal.tsx    # Task detail / edit modal
│   ├── context/
│   │   ├── AuthContext.tsx        # Auth provider (token + login/logout)
│   │   ├── authContextDef.ts      # AuthContext type definition
│   │   └── useAuth.ts            # useAuth hook
│   ├── hooks/
│   │   └── usePwa.ts             # useOnlineStatus & useInstallPrompt hooks
│   ├── pages/
│   │   ├── Dashboard.tsx          # Main task list view
│   │   ├── CalendarView.tsx       # Calendar view of tasks
│   │   ├── Login.tsx              # Login page
│   │   ├── Register.tsx           # Registration page
│   │   └── Tags.tsx               # Tag management page
│   └── types/
│       └── index.ts               # Shared TypeScript interfaces
├── index.html
├── vite.config.ts                 # Vite + PWA + Tailwind config
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
└── package.json
```

---

## Prerequisites

- **Node.js** ≥ 18
- Back-end server running on `http://localhost:5000` (see [back-end README](../back-end/README.md))

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Opens at **http://localhost:5173** by default.

### 3. Build for production

```bash
npm run build
```

Output goes to `dist/`.

### 4. Preview the production build

```bash
npm run preview
```

---

## Available Scripts

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start Vite dev server with HMR           |
| `npm run build`     | Type-check (`tsc -b`) then build for prod |
| `npm run preview`   | Serve the production build locally       |
| `npm run lint`      | Run ESLint                               |

---

## Routes

| Path        | Page          | Auth Required |
| ----------- | ------------- | ------------- |
| `/login`    | Login         | No            |
| `/register` | Register      | No            |
| `/`         | Dashboard     | Yes           |
| `/calendar` | Calendar View | Yes           |
| `/tags`     | Tag Manager   | Yes           |

All protected routes redirect to `/login` when unauthenticated. Login/register redirect to `/` when already authenticated.

---

## Key Features

- **Code-splitting** — Pages and the calendar widget are lazy-loaded with `React.lazy` + `Suspense` for fast initial load.
- **PWA / Offline support** — Service worker with Workbox caches assets and API responses (`NetworkFirst` strategy for API, `CacheFirst` for static assets).
- **JWT authentication** — Token stored in `localStorage`, automatically attached to every API request via Axios interceptors. 401/403 responses trigger automatic logout.
- **Responsive design** — Tailwind utility classes provide a mobile-first layout.
- **Install prompt** — Custom in-app button to trigger native PWA install dialog.

---

## API Configuration

The Axios instance in `src/api/axios.ts` points to:

```
http://localhost:5000/api
```

Update the `baseURL` if your back-end runs on a different host or port.
