# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Ensure Vite is correctly configured for your environment
ENV PORT=5173
ENV HOST=0.0.0.0

# Expose port 5173, which is typically used by Vite
EXPOSE 5173

# Start the development server with the necessary flags
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]