# Creative Login and Authentication

- - - -

## Creative Login Overview

This Login system features a typing cadence recognition test to authenticate the user. This is done by recording the users typing patterns on account creation. When the user logs in the typing patterns are fetched from the database and compared to the login data. 

### Built With
[![Javascript](https://img.shields.io/badge/JavaScript-323330?logo=javascript&logoColor=F7DF1E)](https://www.javascript.com/)
[![NodeJS](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/en)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?logo=reacthookform&logoColor=fff)](https://www.react-hook-form.com/)
[![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?logo=nodemon&logoColor=fff)](https://nodemon.io/)
[![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)](https://expressjs.com/en/)

![Datamon Screenshot](https://github.com/NicciVanZyl/Creative_Authentication/blob/main/frontend/public/githubAssets/LoginPage.png)

## How It Works
Registration: The user types in their username, password and passphrase. They are then taken to the Authentication page where they enter their passphrase 3 times for data gathering. The data gathered inclues the users average flight and dwell times while typing. This data is then stored in the database with the password being hashed.

Login: After the user enters the correct username and password. The user's passphrase is then retrieved from the database as well as their typing cadance.

That data is then compared to new authntication data gathered on the login authentication page since every users typing cadance is unique. 

JWT token is issued upon successful login.

## How To Install

To get started, clone the repo:
```
git clone https://github.com/NicciVanZyl/Creative_Authentication.git
```

Install all the dependencies in both backend and frontend using npm:
```
npm install
```
Add your own .env file in the backend folder:
```
.env file containing the MONGO_URI and JWT string
```
Run the app:
```
npm start
```
Run the backend
```
npm run dev
```
## Why it's creative
This allows the user to authenticate their identity with 2 factor authentication with something that they know - their password and passphrase - as well as something that they are - typing cadance. This allows the user to authenticate their identity with behavioural biometrics data instead of with their physical biometrics data. This can be seen as more userfriendly and convenient while also adding a fresh spin on biometrics authentication. 

## Demonstration
[Link To Demonstration Video](https://drive.google.com/file/d/1ijWpa6PP_GUnpJBKzjsNvLZfb3fmFafX/view?usp=sharing)
