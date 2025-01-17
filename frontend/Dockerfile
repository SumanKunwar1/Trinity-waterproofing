# Use Node.js to build the React app
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install frontend dependencies
RUN npm install --no-optional

# Copy the entire frontend source code
COPY . .

# Expose the port for the React app (adjust as needed, e.g., 3000 for Vite/React)
EXPOSE 5173

# Run the frontend development server (e.g., Vite or Create React App)
CMD ["npm", "run", "dev"]
