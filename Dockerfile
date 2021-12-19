FROM node:16

# Copy all files
COPY . .

# Install Dependencies
RUN npm install

# Build the Project
RUN npm run build

# Expose Port 3000
EXPOSE 3000

# Start the Server
CMD ["npm", "start"]