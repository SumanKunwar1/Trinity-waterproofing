# Use Node.js to build the React app
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the entire frontend source code
COPY . .

# Build the React app
RUN npm run build

# Use an Nginx image to serve the built React app
FROM nginx:alpine

# Copy the built React app from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose the port for the React app
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
