FROM oven/bun:1 AS base
WORKDIR /app

# ── install dependencies ──
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# ── production image ──
FROM base
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 4000

CMD ["bun", "index.ts"]
