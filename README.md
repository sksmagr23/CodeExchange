# CodeExchange

A simplified web application that replicates core functionalities of Stack Overflow. This project is built using Node.js and MongoDB, with a EJS based frontend styled using Tailwind CSS.

## Features

- User authentication with Google and Email/password
- Question and answer management
- Basic user profiles with personal asked questions and answer given
- User can ask questions, answer others questions, delete their own questions and answers and edit their responses(CRUD)
- List all questions and view details of each question
- ```Stack Overflow API integration``` - search and display questions and answers from Stack Overflow
- Tailwind CSS for styling
- Dark/Light theme toggle with persistent user preference
- Markdown support for questions

## Tech Stack

- *Frontend*: EJS, Tailwind CSS
- *Backend*: Node.js, Express.js, Mongoose
- *Database*: MongoDB
- *External API*: Stack Exchange API (for Stack Overflow integration)

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
   MONGO_URL=
   JWT_SECRET=
   SESSION_SECRET=
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   ```
   > get o auth credentials from google cloud console
1. *Start the server*:
   ```bash
   npm run dev
   # The server should now be running at 'http://localhost:3000'
   ```         