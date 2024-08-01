🎉 Project 009 Server

Project based on **Node.js**, just a basic **Node JS** and **Express** server.

💻 Pre Requisites

- **Mongo DB** is required.
- **Node.js** version **21** or greater.

🛒 Dependencies used by the project

1. **mongodb**.
2. **express**.
3. **bcryptjs**.
4. **mongoose**.
5. **jsonwebtoken**.

🛒 Dev Dependencies used by the project

1. **env-cmd**.
2. **nodemon**.

💻 Available scripts

1. `npm run dev` for running the application in local environment.

2. `npm start` for running the application in production environment.

🚀 Required environment variables

1. `databaseURL` specify the database URL to connect to database `./config`.

2. `PORT` specify the port on which the api should run, required in `./config`.

3. `secretKey` specify the secret key for hashing the user passwords `./config`.

🗒️ Instructions

1. Create a database named `project-009-api` in mongodb.

2. Import all the collections form `./public/database` folder into the database.

3. Provide all the required environment variables inside `./.env` file, for reference see `.env.example`.

4. Run `npm i` & `npm start` to run the server.

5. For testing api you can import `./public/api/postman.json` and `./public/api/environments.json`. into postman.
