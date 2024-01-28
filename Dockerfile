# Stage 1: Install dependencies
FROM node:16 as dependencies

WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli@16.2.4

# Install project dependencies
RUN npm install

# Stage 2: Build Angular app
FROM dependencies as build

# Copy the entire project to the working directory
COPY . .

# Build the Angular app
RUN ng build

# Stage 3: Use Nginx to serve the built Angular app
FROM nginx:alpine

# Copy the built Angular app from the build stage
COPY --from=build /app/dist/tp1 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to run the Angular app using Nginx
CMD ["nginx", "-g", "daemon off;"]
