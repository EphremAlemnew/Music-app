FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install all dependencies (dev + prod)
RUN npm install

COPY . .

# Build the app
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

EXPOSE 3000
CMD ["npm", "start"]
