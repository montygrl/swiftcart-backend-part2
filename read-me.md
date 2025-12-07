# Swiftcart E-Commerce API  
**Capstone Project Part 2 – Backend implementation using Node.js, Express, PostgreSQL, and Sequelize ORM**#


# Overview

This backend provides the shopping cart functionality for the Swiftcart e-commerce system, 
a simple e-commerce backend built with Node.js, Express, PostgreSQL (Neon), and Sequelize ORM.  
It supports product listing, shopping cart actions, and checkout.


# Features

- GET /products > list all products  
- POST /cart > add item  
- GET /cart > view cart + totals  
- POST /checkout > create order + order_items and clear cart 


# Tech Stack

**Layer	                 Technology**
- Runtime Environment    Node.js
- Framework              Express
- Database               PostgreSQL (Neon)
- ORM                    Sequelize
- Testing                VS Code REST Client
- Configuration          dotenv (.env)


# Project Structure

├── src/
│   ├── models/
│   ├── routes/
│   ├── db.js
│   ├── server.js
│   └── seed.js (optional)
├── .env
├── package.json
└── swiftcart-tests.rest


# API Endpoints

**Method     Endpoint      Description**
GET          /products     Lists all products

POST         /cart         Adds item to cart

GET          /cart         Shows cart contents + total

DELETE       /cart         Clears cart

POST         /checkout     Creates order & clears cart


# How to Setup + Run

```bash
npm install
### add .env with DATABASE_URL and PORT=3000
npm start

Server runs at http://localhost:3000


## 2. Create .env in the root
DATABASE_URL=postgresql://user:pass@your-project.neon.tech/swiftcart?sslmode=require
PORT=3000

## 3. Start the server
npm start

Server → http://localhost:3000


# TESTING
All API tests are contained in: swiftcart-tests.rest file



# DEPLOYMENT
## Option 1 - How to run locally:
1. Install dependencies:
   ```bash
   npm install

2. Start the server:
  ```bash
   npm start

3. The API is available at:
   http://localhost:3000


## Option 2 - Docker Hub:
1. Stop any running containers:
   ```bash
    docker-compose down

2. Build the image and start the container:
   ```bash
   docker-compose up --build  
    
    This will:
  - Build the image from the Dockerfile
  - Start the container with environment variables from .env
  - Map to port 3000 so that the API is available at http://localhost:3000

3. Verify container is running:
     ```bash
     docker ps   
     (response should be 'swiftcart-backend-web should be listening on port 3000'.)  

 
   The container image for this project is published to Docker Hub:
     docker pull lesliemontgomery/swiftcart-api:latest

### Docker Hub Image
    The container image for this project is published to Docker Hub and can be pulled here:
    ```bash
    docker pull leslie1002/swiftcart-api:latest 

    
## Environment Variables 
    Required values in .env:
      DATABASE_URL=postgresql://user:pass@your-project.neon.tech/swiftcart?sslmode=require PORT=3000



# AWS Elastic Beanstalk Deployment

This project was deployed to AWS Elastic Beanstalk using Docker.

### Steps
1. Docker Image Build & Push
   - Built the image locally:
     ```bash
     docker build -t leslie1002/swiftcart-api:latest .
     ```
   - Pushed to Docker Hub:
     ```bash
     docker push leslie1002/swiftcart-api:latest
     ```

2. Dockerrun.aws.json
   - Created a `Dockerrun.aws.json` file:
     ```json
     {
       "AWSEBDockerrunVersion": "1",
       "Image": {
         "Name": "leslie1002/swiftcart-api:latest",
         "Update": "true"
       },
       "Ports": [
         {
           "ContainerPort": "8080"
         }
       ]
     }
     ```
   - Zipped and uploaded to Elastic Beanstalk.

3. Environment Configuration
   - Set environment variables in EB:
     - `PORT=8080`
     - `DATABASE_URL=postgresql://<username>:<password>@<host>/<dbname>?sslmode=require`

4. Deployment
   - Deployed to environment:  
     ```
     http://swiftcart-api-env.eba-kaprvkk8.ca-central-1.elasticbeanstalk.com
     ```

    ### Endpoints
    - `/products` → returns product JSON  
    - `/orders` → returns order JSON  
     - `/users` → returns user JSON  