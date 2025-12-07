# LAYER 1: BASE IMAGE. node "18" is accepted version for 2025
FROM node:18  

# LAYER 2: Add app source code / set working directory inside container
WORKDIR /app             

# LAYER 3: Copy dependencies definitions (reads from package.JSON)
COPY package*.json ./      

# LAYER 4: Install dependencies, this layer is cached (SHELL FORM)
RUN npm install          

# COPY the rest of the app source code
COPY . .

# Set the ENVIRONMENT VARIABLES inside the container
ENV PORT=3000

# EXPOSE the port the app will run on
EXPOSE 3000

# Start application (EXEC FORM)
CMD ["npm", "start"]
