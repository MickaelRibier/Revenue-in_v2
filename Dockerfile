# ─────────────────────────────────────────────
# Stage 1 — dependencies
# ─────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ─────────────────────────────────────────────
# Stage 2 — runtime
# ─────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# System timezone (optional but nice for logs)
ENV TZ=Europe/Paris

# Copy installed modules from stage 1
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
