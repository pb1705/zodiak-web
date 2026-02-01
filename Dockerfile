# Dockerfile - Build locally first, then use this
# Step 1: Run 'npm run build' locally on your machine
# Step 2: Then build Docker image: docker build -t zodiak-website:latest .
#
# Alternative: Use Dockerfile.local for copying pre-built files

# Stage 1: Runner (expects pre-built .next directory from local build)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application from local build
# These files should exist after running 'npm run build' locally
COPY --chown=nextjs:nodejs public ./public
COPY --chown=nextjs:nodejs .next/standalone ./
COPY --chown=nextjs:nodejs .next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# App env (single-team project: set in image; override via docker-compose if needed)
ENV NEXT_PUBLIC_BASE_URL=https://zodiak.life
ENV ADMIN_SECRET=zodiak-admin-secret

CMD ["node", "server.js"]