# CodeExchange

A simplified web application that replicates core functionalities of Stack Overflow. This project is built using Node.js and MongoDB, with a front end styled using Tailwind CSS.

## Features

- User authentication with JWT
- Question and answer management
- Basic user profiles with personal asked questions and answer given
- User can ask questions, answer questions, delete their own questions and answers
- List all questions and view details of each question
- Tailwind CSS for styling

## Tech Stack

- *Frontend*: EJS, Tailwind CSS
- *Backend*: Node.js, Express.js, Mongoose
- *Database*: MongoDB(using compass)

## Installation and setup

1. *Clone the repository*:
   ```bash
   git clone https://github.com/sksmagr23/CodeExchange.git
   cd CodeExchange
   ```
1. *Install dependencies*:
   ```bash
   npm install
   ```
1. *Create a .env file in root directory and set up environment variables*:
   ```Env
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
1. *Start the server*:
   ```bash
   node app
   // The server should now be running at 'http://localhost:3000'
   ```         

## API Documentation
### Authentication Routes
- Register User:
  - POST /api/auth/register
  - Request Body:
    ```json
    {
     "username": "yourusername",
     "email": "youremail@example.com",
     "password": "yourpassword"
    }
    ``` 
  - Response:
    ```json
    {
     "token": "your_jwt_token"
    }
    ```
- Login User:
  - POST /api/auth/login
  - Request Body:
    ```json
    {
     "email": "youremail@example.com",
     "password": "yourpassword"
    }
    ``` 
  - Response:
    ```json
    {
     "token": "your_jwt_token"
    }
    ```
- Logout User:
  - GET /api/auth/logout
  - Response:
    ```json
    {
     "message":"Logged out successfully"
    }
    ```        
### User Routes 
- Get User Profile:
  - GET /profile
  - Headers:
    ```json
    {
     "Authorization":"Bearer your_jwt_token"
    }
    ``` 
  - Response:
    ```json
    {
     "username": "yourusername",
     "email": "youremail@example.com",
     "questions": [...],
     "answers": [...]
    }
    ```   
### Question Routes    
- Get All Questions:
  - GET /questions
  - Response:
    ```json
    [
     {
     "_id": "question_id",
     "title": "Question Title",
     "description": "Question Description",
     "user": {
     "username": "username"
     },
     "createdAt": "date_string"
     },
    ...
    ]
    ```
- Get Questions By ID:
  - GET /questions/:id
  - Response:
    ```json
    {
     "_id": "question_id",
     "title": "Question Title",
     "description": "Question Description",
     "user": {
       "username": "username"
     },
     "createdAt": "date_string",
     "answers": [
     {
      "_id": "answer_id",
      "text": "Answer Text",
      "user": {
        "username": "username"
      },
      "createdAt": "date_string"
     },
    ...
    ]
    }
    ```
- Create Question:
  - POST /questions
  - Headers:
    ```json
    {
     "Authorization":"Bearer your_jwt_token"
    }
    ``` 
  - Request Body:
    ```json
    {
     "title": "Question Title",
     "description": "Question Description"
    }
    ```   
  - Response:
    ```json
    {
     "_id": "question_id",
     "title": "Question Title",
     "description": "Question Description",
     "user": "user_id",
     "createdAt": "date_string"
    }
    ```   
- Delete Question:
  - DELETE /questions/:id
  - Headers:
    ```json
    {
     "Authorization":"Bearer your_jwt_token"
    }
    ``` 
  - Response:
    ```json
    {
     "message":"Question deleted"
    }
    ```               
### Answer Routes    
- Create Answer
  - POST /questions/:id/answers
  - Headers:
    ```json
    {
     "Authorization":"Bearer your_jwt_token"
    }
    ``` 
  - Request Body:
    ```json
    {
     "text":"Answer Text"
    }
    ```   
  - Response:
    ```json
    {
     "_id": "answer_id",
     "text": "Answer Text",
     "user": "user_id",
     "question": "question_id",
     "createdAt": "date_string"
    }
    ```    