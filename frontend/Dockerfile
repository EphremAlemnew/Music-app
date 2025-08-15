FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install all dependencies (dev + prod)
RUN npm install

# Ensure TypeScript is available
RUN npm install -g typescript

COPY . .

# Build the app
RUN npm run build

# Keep dev dependencies for TypeScript compilation
# RUN npm prune --production

EXPOSE 3000
CMD ["npm", "start"]
