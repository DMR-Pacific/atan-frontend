# From google search ai response

# Stage 1 Dependency installation (base stage) 
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json*  ./
RUN npm install --frozen-lockfile

# ==========================
#  Stage 2: Build the application
FROM node:20-alpine as builder
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
RUN npm run build:prod


# ==========================
# Stage 3: Run the application (runner stage)
FROM node:20-alpine AS runner
WORKDIR /app

# Copy the standalone output, public, and static files from the builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public

# If you have a .next/static folder you need to copy that too
COPY --from=builder /app/.next/static ./.next/static

# Set the environment variable for production 
ENV NODE_ENV production

# This is the port it runs in the container
EXPOSE 4000

ENV PORT=4000
# Command to start the application

# CMD ["npm", "run", "start"]
CMD ["node", "server.js"]

