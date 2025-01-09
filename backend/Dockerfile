# Use Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript

# Copy the entire backend source code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the backend port (5000 in this case)
EXPOSE 5000

# Start the backend server
CMD ["node", "dist/server.js"]
