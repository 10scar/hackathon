# Imagen para producción: Next.js + Prisma aplicando schema al Postgres del compose antes de iniciar.

FROM node:22-bookworm-slim AS runner

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./

# Sin package-lock.json en el repo — para builds más estables podéis añadir un lockfile y usar `npm ci`.
RUN npm install

COPY prisma ./prisma
COPY prisma.config.ts ./
COPY public ./public
COPY src ./src
COPY tsconfig.json next-env.d.ts next.config.ts postcss.config.mjs ./

ARG NEXT_PUBLIC_SUPABASE_URL=""
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=""
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

RUN npx prisma generate \
  && npm run build

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

# Sincroniza tablas desde el schema Prisma local (este repo no versiona migrations).
CMD ["sh", "-c", "npx prisma db push --skip-generate && exec npm run start"]
