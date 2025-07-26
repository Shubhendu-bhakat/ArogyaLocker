# FROM node:22-alpine 
# WORKDIR /app
# COPY  . .
# RUN npm install
# RUN npm run build 
# EXPOSE 3000
# CMD [ "npm","run build" ]

# Step 1: Build with Vite

FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
# Build with TypeScript checks skipped
RUN npm run build

# Step 2: Serve the built app with a lightweight server
FROM node:22-alpine

WORKDIR /app
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
