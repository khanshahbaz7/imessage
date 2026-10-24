# --- Stage 1: build the SPA (Vite) ---
FROM oven/bun:1.4.3 AS frontend-build

WORKDIR /app/frontend

COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile

COPY frontend/ ./

# Browser calls /api on the same host as the page.
ENV VITE_API_URL=

# Public Clerk publishable key is embedded in client JS.
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

RUN bun run build


# --- Stage 2: build the API ---
FROM oven/bun:1.4.3 AS backend-build

WORKDIR /app

COPY backend/package.json backend/bun.lock ./
RUN bun install --frozen-lockfile

COPY backend/ ./

RUN bun run build


# --- Stage 3: production runtime ---
FROM oven/bun:1.4.3 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Install only production dependencies
COPY backend/package.json backend/bun.lock ./
RUN bun install --frozen-lockfile --production

# Copy compiled backend
COPY --from=backend-build /app/dist ./dist

# Copy Vite's production build
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 3001

USER bun

CMD ["bun", "dist/index.js"]