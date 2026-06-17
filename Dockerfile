FROM node:20-alpine AS builder

WORKDIR /app

# Accept build-time env vars for Vite
ARG VITE_API_BASE_URL=/api/v1
ARG VITE_SITE_HOST
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SITE_HOST=$VITE_SITE_HOST
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

COPY package.json bun.lockb* package-lock.json* ./
RUN npm ci || npm install

COPY . .
RUN npm run build

# --- Production (nginx serves the static build) ---
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
