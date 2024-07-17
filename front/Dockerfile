# Use the official Node.js image as the base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./
COPY postinstall.js ./

RUN npm install
RUN npm run postinstall
# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Serve the application using serve
RUN npm install -g serve
# CMD ["serve", "-s", "dist"]
CMD ["serve", "-s", "dist", "-p", "5000"]

# Expose port 5000
EXPOSE 5000
