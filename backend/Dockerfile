# Use Node.js as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the entire backend source code
COPY . .

# Expose the backend port (adjust as needed, e.g., 3000)
EXPOSE 5000

# Define the command to run the backend server
CMD ["npm", "start"]
