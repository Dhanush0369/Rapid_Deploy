# Use a Node.js image
FROM node:18-alpine

# Install Git
RUN apk add --no-cache git

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY src ./src

# Expose the port and start the service
EXPOSE 3000
CMD ["npm", "start"]