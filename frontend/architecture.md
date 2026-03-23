# Athena Website Builder - Architecture Overview

This document outlines the high-level architecture and code flow for the Athena Website Builder, focusing on the backend components as detailed in the "Website Builder Features List" planning document.

## 1. High-Level Architecture

The Athena Website Builder is designed as a multi-tenant platform with a strong emphasis on user-based data isolation and role-based access control. It consists of several key modules that handle authentication, website management, content presentation, versioning, rendering, and analytics.

**Key Principles:**
*   **Multi-tenancy:** Support multiple users with strict data isolation.
*   **User-Based Data Isolation:** All resources scoped to a user.
*   **Role-Based Access Control (RBAC):** Differentiated access for Viewer, User, and Admin roles.
*   **Modularity:** Independent components for pages, sections, layouts, and themes.
*   **Scalability:** Sections stored as separate entities.
*   **Version Control:** Draft and published versions with rollback capability.
*   **Dynamic Rendering:** On-demand content assembly for frontend.

## 2. Core Components and Modules

### 2.1. Authentication + Authorization Service

*   **Purpose:** Manages user authentication, session management, and access control based on roles.
*   **Features:**
    *   **JWT Authentication:** Uses short-lived access tokens and long-lived refresh tokens.
    *   **Multi-tenant & User-Based Data Isolation:** Ensures all data operations are scoped to the authenticated user.
    *   **Role-Based Access Control (RBAC):** Enforces permissions for `Viewer`, `User`, and `Admin` roles.
        *   `Viewer`: Public access to published websites (no auth).
        *   `User`: Manage own websites (CRUD, publish).
        *   `Admin`: Full control over users, websites, templates, domains.

### 2.2. Admin Dashboard Service

*   **Purpose:** Provides an administrative interface for users and admins to manage platform resources.
*   **Features:**
    *   **My Websites List:** For `User` role, lists owned websites with details (name, domain, status, last updated) and quick actions.
    *   **All Websites List:** For `Admin` role, view all websites across the platform.
    *   **Users List:** For `Admin` role, manages user accounts.
    *   **Pages List:** Displays pages belonging to the currently selected website.
    *   **Deployment Management:** Manages website versions and deployment status.
    *   **Other Configurations:** Manages general platform settings.

### 2.3. Website Management Service

*   **Purpose:** Handles the lifecycle of websites, from creation to settings and status.
*   **Features:**
    *   **Website Creation Workflow:** Allows users to create new websites with default layouts, themes, and a home page.
    *   **Template Gallery:** `Admin` can add predefined templates (layouts, themes, styles) for users to choose from.
    *   **Website Settings Management:** Manages SEO, contact info, social links, favicon, and custom scripts.
    *   **Website Status Management:** Tracks states (draft, published, deleted).
    *   **Domain Assignment:** Assigns a unique domain to each website.

### 2.4. Presentation Management Service

*   **Purpose:** Manages the structured content and styling of websites.
*   **Features:**
    *   **Page Management:** Create multiple pages per website, linked to the parent website.
    *   **Page Slug Routing:** Dynamic page rendering using `website_slug + page_slug`.
    *   **Modular Section Architecture:**
        *   **Independent Section Documents:** Sections stored as separate entities, linked to pages.
        *   **Section Type System:** Supports predefined types (hero, features, testimonials) with content schemas.
        *   **Global Sections (Navbar/Footer):** Sections marked as global, linked to the website's layout.
    *   **Layout Management:** Global layout system per website for reusable components.
    *   **Theme & Styling Engine:**
        *   **Theme Management (Design Tokens):** Global styling (colors, typography) stored separately.
        *   **Tailwind Utility-Based Styling:** Persists styling as utility class strings.

### 2.5. Versioning & Concurrency Service

*   **Purpose:** Manages different versions of website content and ensures data integrity during edits.
*   **Features:**
    *   **Version Control:** Manages editable draft versions and published versions.
    *   **Auto-save:** Automatically saves changes to the current draft version every 30 seconds.
    *   **Manual Save/Publish:** Creates a new version on manual save or publish action.
    *   **Rollback Capability:** Enables reverting to previously saved versions.

### 2.6. Rendering & Publishing Service

*   **Purpose:** Assembles website content for frontend display and manages public accessibility.
*   **Features:**
    *   **Dynamic Rendering Engine:** Merges layout, page, and ordered sections into a structured response for the frontend.
    *   **Published vs Draft State Management:** Serves only published content to public users.
    *   **Domain Mapping:** Maps public domains to internal resource IDs for access.

### 2.7. Post-Publish & Analytics Service

*   **Purpose:** Collects and displays analytics data for published websites.
*   **Features:**
    *   **Views Count:** Tracks views per page.
    *   **Published Counts:** Total number of published websites.
    *   **Traffic Sources:** Monitors where traffic originates.
    *   **Uptime:** Health checks for published sites.

## 3. Code Flow - High-Level Interaction

This section describes a typical flow of how different services interact.

1.  **User Login/Authentication:**
    *   Frontend sends login credentials to **Auth Service**.
    *   **Auth Service** authenticates, generates JWT (access + refresh tokens), and returns them to the frontend.

2.  **Accessing Admin Dashboard:**
    *   Frontend sends requests to **Admin Dashboard Service** with JWT in headers.
    *   **Auth Service** validates JWT and authorizes based on user role.
    *   **Admin Dashboard Service** queries **Website Management Service** (for website lists), **Auth Service** (for user lists if admin), and **Versioning Service** (for deployment status).
    *   Data is returned to the frontend for display.

3.  **Website Creation:**
    *   Frontend sends website creation request (e.g., template choice) to **Website Management Service**.
    *   **Website Management Service** interacts with **Presentation Management Service** to create default pages and sections based on the template.
    *   It also interacts with a Domain Management component to assign a unique domain.
    *   The new website entry is created, initially in `draft` status.

4.  **Editing Website Content (e.g., a Section):**
    *   Frontend requests a specific website/page/section from **Presentation Management Service** via **Auth Service** for authorization.
    *   **Presentation Management Service** retrieves content, potentially from **Versioning Service** (to get the latest draft).
    *   User makes edits on the frontend.
    *   Every 30 seconds, frontend sends `auto-save` requests to **Versioning Service**, which updates the current draft.
    *   On explicit `Save` or `Publish` action, frontend sends a request to **Versioning Service** to create a new version.

5.  **Publishing a Website:**
    *   Frontend sends a `publish` request for a website to **Website Management Service**.
    *   **Website Management Service** updates the website status to `published` and triggers **Rendering & Publishing Service**.
    *   **Rendering & Publishing Service** processes the latest published version of the website (layout, pages, sections) and makes it available for public access via its assigned domain.

6.  **Public Website Access:**
    *   A public `Viewer` accesses `mysite.athenalms.com`.
    *   **Rendering & Publishing Service** receives the request via domain mapping.
    *   It dynamically retrieves the *published* version of the website content (layout, pages, sections) from **Presentation Management Service** and **Versioning Service**.
    *   The structured content is sent to the frontend for rendering.
    *   **Post-Publish & Analytics Service** records the view count and other traffic data.

7.  **Admin Managing Templates:**
    *   An `Admin` accesses the template management section in the dashboard.
    *   **Admin Dashboard Service** authenticates and authorizes the `Admin`.
    *   `Admin` adds a new template via **Website Management Service**, which then stores the template definition (including default layout, sections, theme) within the **Presentation Management Service**.
