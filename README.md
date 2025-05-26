# CodeExchange

A simplified web application that replicates core functionalities of Stack Overflow. This project is built using Node.js and MongoDB, with a EJS based frontend styled using Tailwind CSS.

## Features

- User authentication with Google and Email/password
- Question and answer management
- Basic user profiles with personal asked questions and answer given
- User can ask questions, answer others questions, delete their own questions and answers
- List all questions and view details of each question
- Tailwind CSS for styling
- Dark/Light theme toggle with persistent user preference
- Markdown support for questions

## Tech Stack

- *Frontend*: EJS, Tailwind CSS
- *Backend*: Node.js, Express.js, Mongoose
- *Database*: MongoDB

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
   // The server should now be running at 'http://localhost:3000'
   ```         