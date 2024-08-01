## 🎉 E-commerce Application

Project based on **Next.js** just a rather simple E-commerce application.

### 💻 Pre Requisites

- **Node.js** version **21** or greater.

### 🛒 Dependencies used by the project

1.  **react**
2.  **cross-env**
3.  **react-dom**
4.  **@strapi/strapi**
5.  **better-sqlite3**
6.  **react-router-dom**
7.  **styled-components**
8.  **@strapi/plugin-i18n**
9.  **@strapi/plugin-cloud**
10. **@strapi/plugin-users-permissions**

### 🚀 Available scripts

1. `npm run strapi` for internal strapi usages.

2. `npm run deploy` for deploying the application to the cloud.

3. `npm run develop` for running the application in local environment.

4. `npm run start` for running the application in production environment.

5. `npm run build` for building the application for production environment.

### ✈️ Required environment variables

#### ✈️ Server Variables

1.  `PORT` port number where server is actually running.

2.  `HOST` name of the host where server is actually running.

3.  `TRANSFER_TOKEN_SALT` any hashed `22 bit` string followed by `==` for token transfer.

4.  `JWT_SECRET` any hashed `22 bit` string followed by `==` for generating `JWT Tokens`.

5.  `API_TOKEN_SALT` any hashed `22 bit` string followed by `==` for generating `API Token`.

6.  `ADMIN_JWT_SECRET` any hashed `22 bit` string followed by `==` for generating `ADMIN Token`.

7.  `APP_KEYS` any hashed `22 bit` string followed by `==` multiple keys can be specified using a `comma` seprator.

#### ✈️ Database Variables

1.  `DATABASE_FILENAME` location of the `.db` file.

2.  `DATABASE_CLIENT` for connecting to specific `database`.

#### 🚀 Postman collection for api can be found in `./public/api` folder.
