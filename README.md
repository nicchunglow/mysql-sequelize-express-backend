# Ufinity assessment

##### By Nicholas Chung

## Table of Contents

\- [Introduction](#Introduction)

\- [Technologies](#Technologies)

\- [Setup](#Setup)

\- [Environment Variables](#Environment-Variables)

\- [Available Scripts](#Available-Scripts)

\- [Available Routes](#Available-Routes)

\- [Things to note](#Things-to-note.)

\- [Design Considerations](#Design-Considerations)

## Introduction

Teachers need a system where they can perform administrative functions for their students. Teachers and students are identified by their email addresses.
There are four main functionalities:

1. Get a list of routes available.
2. Registering a teacher and student together, creating new inputs in the databse should the teacher or the student/s did not exist.
3. Retrieve list of students with a given list of teachers.
4. Suspending a student.
5. Retrieve a list of students who can receive a given notification by a teacher.

## Technologies

\- JavaScript

\- node : 13.5.0

\- express: 4.17.1

\- mysql2 : 2.1.0

\- sequelize : 5.21.10

\- jest : 26.0.1

\- supertest: 4.0.2

\- dotenv: 8.2.0

\- nodemon: 2.0.4

## Setup

To run this project, git clone and install it locally using npm:

\```

cd ..

git clone

npm install

npm start

\```

For users are new to MySQL, you can choose to use MySQL Workbench for your MySQL Database.

\- Head over to https://dev.mysql.com/downloads/ to download the MySQL according to your computer's OS.

\*note - You may face an issue with MySQL default port unable to set at 3306. Just change to another port number (e.g 3300) and you will be able to continue using MySQL.

## Environment Variables

- DB_SCHEMA_NAME = The name of your MySQL Schema you set.

* DB_USERNAME = The username you created your MySQL Schema with.

- DB_PASSWORD = The password of your account you create your MySQL Schema with.

- PORT = On local, you will set it on 3000. Else, follow the credentials given by the database.

\## Available Scripts

In the project directory, you can run:

\```

npm start // runs the app in development mode

npm run start:dev // runs the app in nodemon

npm test // runs test runner without watch mode

npm run testc // runs test coverage without watch mode

\```

## Available Routes

\```

    "0": "GET    /",
    "1": "POST   /api/register",
    "2": "GET   /api/commonstudents",
    "3": "POST   /api/suspend",
    "4": "POST   /api/retrievefornotifications",

\```

## Things to note

To test the code in a local environment, it will be best to include these inputs in your database:

teacher : teacherken@gmail.com, teacherben@gmail.com

student : studentjon@example.com, studenthon@example.com, student_only_under_teacher_ken@gmail.com,

Relation : teacherken@gmail.com to be registered with all three students.

teacherben@gmail.com to be registered without "student_only_under_teacher_ken@gmail.com".

## Design Considerations

Error handlers: 
 - When input is empty
 - When input is false and search returns null. (Teacher or student is unavailable.)
 -

Edge cases : 
"1": "POST   /api/register"
    - Only one teacher can be registering to other students
"2": "GET   /api/commonstudents"
    - To throw error if there is a invalid teacher in a multi-teacher scenario.
"3": "POST   /api/suspend"
    - To suspend only one student at a time
"4": "POST   /api/retrievefornotifications"
    -Able to retrieve students registered to teacher or mentioned that are *not suspended* and *without duplicate names*. 
    