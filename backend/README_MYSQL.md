# MySQL backend setup

This backend now persists runtime data in a real MySQL database instead of the previous in-memory/file-backed `state` object.

## 1. Install the MySQL driver

```bash
npm install mysql2 --save
```

The server imports the promise API with:

```js
const mysql = require('mysql2/promise');
```

## 2. Create the database and tables

Run the schema file with a MySQL user that can create databases and tables:

```bash
mysql -u root -p < backend/sql/healthcare_schema.sql
```

The schema creates `healthcare_db` and tables for auth, users, OTP requests, uploads, AI feedback, food logs, medication plans, chat sessions/messages, active workouts, and completed workouts.

## 3. Configure connection variables

The pool in `backend/server.js` reads these environment variables:

```bash
export MYSQL_HOST=127.0.0.1
export MYSQL_PORT=3306
export MYSQL_USER=root
export MYSQL_PASSWORD=your_password
export MYSQL_DATABASE=healthcare_db
export MYSQL_CONNECTION_LIMIT=10
```

## 4. Start backend

```bash
npm run backend
```

The API routes and JSON response bodies are kept compatible with the React Native app.