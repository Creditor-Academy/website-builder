# 🏗️ Buildora (Athena) - Frontend Application

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Welcome to the **Frontend Repository** for **Buildora** (codename *Athena*), a multi-tenant SaaS website builder platform. This application allows institutions, universities, and individuals to build, publish, and manage professional websites seamlessly without writing a single line of code.

---

## ✨ Key Features

- **Multi-Tenant Architecture**: Robust support for Super Admins, Institution Admins, and standard Users.
- **Visual Website Builder**: A drag-and-drop / component-based WYSIWYG editor.
- **Custom Domains & Subdomains**: Integrated DNS management for automated SSL and custom domain mapping via AWS CloudFront.
- **Dynamic Dashboards**: Comprehensive management interfaces for users, templates, websites, and form submissions.
- **Modern UI/UX**: Built with `shadcn/ui` and `Tailwind CSS` for a highly responsive, premium aesthetic.

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Core Framework** | **React 18** | Built with Strict Mode and modern Hooks. |
| **Build Tool** | **Vite** | Blazing fast HMR and optimized production bundling. |
| **Language** | **TypeScript 5+** | End-to-end type safety. |
| **Styling** | **Tailwind CSS** | Utility-first styling with custom themes. |
| **UI Components** | **shadcn/ui** | Accessible, customizable radix-ui based components. |
| **State Management** | **Zustand** | Lightweight, fast global state management. |
| **Routing** | **React Router v6** | Client-side routing with protected routes. |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 1. Installation

Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd website-builder
npm install
```

### 2. Environment Configuration

Create a local environment file based on the provided template:

```bash
cp .env.example .env.local
```

Ensure the following critical variables are set:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1  # Points to your local or staging backend
VITE_SITE_HOST=https://buildora.lmsathena.com   # Platform host domain
```

### 3. Start Development Server

Run the Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 🏗️ Project Structure

```text
src/
├── api/              # Axios instances and API request wrappers
├── assets/           # Static assets, images, and global icons
├── components/       # Reusable UI components (buttons, dialogs, form inputs)
│   ├── dashboard/    # Dashboard-specific components
│   ├── editor/       # Core website builder interface components
│   └── ui/           # Generic shadcn/ui components
├── contexts/         # React Context providers (Auth, Theme, etc.)
├── hooks/            # Custom reusable React hooks
├── layouts/          # Structural page layouts (DashboardLayout, etc.)
├── pages/            # Routable page components (Login, Editor, Dashboard, etc.)
├── store/            # Zustand global state stores (useBuilderStore, etc.)
├── types/            # Global TypeScript interfaces and type definitions
├── utils/            # Helper functions and utilities
├── App.tsx           # Application root and router configuration
└── main.tsx          # React DOM entry point
```

---

## 🐳 Docker Deployment

To build and run the frontend as an Nginx-served Docker container for staging or local testing:

```bash
docker-compose up --build -d
```
The application will be served on port `80` inside the container, mapped according to your `docker-compose.yml`.

---

## 🚢 Production Deployment

This project is configured for an AWS 3-tier architecture (S3 + CloudFront + ACM). 

To create a production-ready optimized build:
```bash
npm run build
```
This generates the `dist/` directory, containing the highly minified, chunked static assets ready to be synced to the AWS S3 origin bucket. 

> **Note on CI/CD:** A `Jenkinsfile` is utilized for automated testing, linting, and deployment to the AWS environment.

---

## 🔒 Authentication & Security

- **Cookie-Based JWT:** The frontend relies on `httpOnly` secure cookies set by the backend for authentication. Ensure your local environment is configured to send credentials (`withCredentials: true` in Axios).
- **Protected Routes:** React Router handles client-side protection for Admin and Institution-specific views based on user roles (`SUPER_ADMIN`, `INSTITUTION_ADMIN`, `USER`).

---

## 💻 Contribution Guidelines

1. Ensure all code is strictly typed. Avoid `any` where possible.
2. Maintain standard ESLint rules. Run `npm run lint` before committing.
3. Component modifications should adhere to the established Tailwind CSS and `shadcn/ui` design system.
4. Document any new environment variables in both `.env.example` and this README.
