# Use Node LTS
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Expose backend port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the app
CMD ["node", "main.js"]
