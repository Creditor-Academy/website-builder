# Buildora - Frontend 

This is the React Single Page Application (SPA) for the Buildora Website Builder platform.

## Tech Stack
- React 18
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Create a `.env.local` file by copying `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Ensure `VITE_API_BASE_URL` points to your running backend (e.g., `http://localhost:5000/api/v1`).

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Building for Production
To build the application for production deployment:
```bash
npm run build
```
The optimized static files will be placed in the `dist/` directory.

## Docker
To build the frontend as an Nginx-served Docker container:
```bash
docker-compose up --build
```
