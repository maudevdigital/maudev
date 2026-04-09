# ── Stage 1: Install & Build ──
FROM node:22-slim AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace config
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json tsconfig.json ./
COPY .npmrc* ./

# Copy all package.json files for dependency resolution
COPY artifacts/api-server/package.json artifacts/api-server/
COPY artifacts/api-server/tsconfig.json artifacts/api-server/
COPY artifacts/api-server/build.mjs artifacts/api-server/
COPY artifacts/maudev/package.json artifacts/maudev/
COPY artifacts/maudev/tsconfig.json artifacts/maudev/
COPY artifacts/maudev/vite.config.ts artifacts/maudev/
COPY lib/api-client-react/package.json lib/api-client-react/
COPY lib/api-client-react/tsconfig.json lib/api-client-react/
COPY lib/api-spec/package.json lib/api-spec/
COPY lib/api-zod/package.json lib/api-zod/
COPY lib/api-zod/tsconfig.json lib/api-zod/
COPY lib/db/package.json lib/db/
COPY lib/db/tsconfig.json lib/db/
COPY scripts/package.json scripts/
COPY scripts/tsconfig.json scripts/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build frontend (needs VITE_ env vars at build time)
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

RUN cd artifacts/maudev && pnpm run build

# Build backend
RUN cd artifacts/api-server && pnpm run build

# ── Stage 2: Production ──
FROM node:22-slim AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy built artifacts
COPY --from=builder /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=builder /app/artifacts/maudev/dist/public ./artifacts/maudev/dist/public

# Copy workspace config for pnpm
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=builder /app/.npmrc* ./
COPY --from=builder /app/artifacts/api-server/package.json ./artifacts/api-server/
COPY --from=builder /app/artifacts/maudev/package.json ./artifacts/maudev/
COPY --from=builder /app/lib/api-client-react/package.json ./lib/api-client-react/
COPY --from=builder /app/lib/api-spec/package.json ./lib/api-spec/
COPY --from=builder /app/lib/api-zod/package.json ./lib/api-zod/
COPY --from=builder /app/lib/db/package.json ./lib/db/
COPY --from=builder /app/scripts/package.json ./scripts/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy node_modules that the bundled server might need
COPY --from=builder /app/node_modules/.pnpm ./node_modules/.pnpm

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]
