# Use Node.js as the base image
FROM node:16-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm install
RUN cd frontend && npm install

# Copy project files
COPY . .

# Build the React app
RUN cd frontend && npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=build /app/frontend/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]