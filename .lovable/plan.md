

# Wedding Planner SaaS Platform — Full MVP Plan

## Overview

A frontend-only MVP with a landing page, role-based login simulation (no real auth yet), and three distinct dashboard experiences for Wedding Planners, Customers (couples), and Vendors.

## Architecture

```text
/                  → Landing page (hero, features, pricing, CTA)
/login             → Role selector + simulated login
/planner/dashboard → Planner dashboard (sidebar layout)
/client/dashboard  → Customer/couple dashboard (sidebar layout)
/vendor/dashboard  → Vendor dashboard (sidebar layout)
```

User role will be stored in React context (no backend). Each dashboard gets its own sidebar and pages.

---

## What We'll Build

### 1. Landing Page
- Hero section with headline, subtext, CTA buttons ("Get Started", "Book a Demo")
- Features grid (4 features: event management, budgeting, vendor marketplace, messaging)
- Pricing section (3 tiers: Free, Pro, Enterprise)
- Footer

### 2. Login / Role Selection Page
- Simple page where users pick their role (Planner, Customer, Vendor) and click "Enter Dashboard"
- Stores role in a UserContext provider
- No real auth — just role simulation for now

### 3. Wedding Planner Dashboard
Sidebar nav: Dashboard, Weddings, Clients, Vendors, Budget, Messages, Settings
- **Dashboard**: Overview cards (upcoming weddings, pending tasks, budget summary, unread messages)
- **Weddings**: List of weddings with status badges, timeline view
- **Clients**: Client list with contact info
- **Vendors**: Browse/manage vendor relationships
- **Budget**: Budget tracker with categories and progress bars
- **Messages**: Inbox placeholder

### 4. Customer (Couple) Dashboard
Sidebar nav: Dashboard, My Wedding, Vendors, Budget, Messages, Settings
- **Dashboard**: Wedding countdown, checklist progress, budget overview
- **My Wedding**: Timeline, guest list summary, venue details
- **Vendors**: Booked vendors and marketplace browse
- **Budget**: View shared budget from planner
- **Messages**: Communication with planner

### 5. Vendor Dashboard
Sidebar nav: Dashboard, Bookings, Services, Reviews, Messages, Settings
- **Dashboard**: Upcoming bookings, revenue summary, new inquiries
- **Bookings**: Calendar/list of confirmed and pending bookings
- **Services**: Manage service offerings and pricing
- **Reviews**: Customer review list
- **Messages**: Communication with planners/couples

---

## Technical Approach

- **Routing**: React Router with nested routes per role
- **State**: React Context for user role, mock data arrays for dashboard content
- **Layout**: Shadcn Sidebar component (collapsible) per role with role-specific nav items
- **UI**: Shadcn Card, Badge, Button, Tabs, Progress components
- **Styling**: Tailwind with a warm wedding-appropriate color palette (updated CSS variables)
- **Data**: All mock/static data — no backend calls

## Files to Create/Modify

| File | Purpose |
|------|---------|
| `src/index.css` | Updated color palette |
| `src/contexts/UserContext.tsx` | Role context provider |
| `src/pages/Landing.tsx` | Landing page |
| `src/pages/Login.tsx` | Role selection page |
| `src/layouts/DashboardLayout.tsx` | Shared sidebar layout |
| `src/components/planner/*` | Planner dashboard pages |
| `src/components/client/*` | Customer dashboard pages |
| `src/components/vendor/*` | Vendor dashboard pages |
| `src/App.tsx` | All routes |

This builds a complete navigable frontend MVP. Backend (auth, database, real data) can be added incrementally later.

