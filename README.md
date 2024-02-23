#News API
## Hosted project

Here is the link to the live API

*https://project-nc-news-9s8b.onrender.com/api/*

My project focuses on the development of an Application Programming Interface (API) based on a news website. 
 
 - The project began by carefully thinking about the API architecture. I wanted the architecture to be felxible and easily allow
 for updates and the option to scale the API further while being comprehensible for other developers to understand.

 - This project was built with the purpose of continuous learning and development of an API. creating multiple endpoints with a range of queries.

# How to install

## creating a connection to the databse 
In order to accsess the databases locally you must create your own .env files and update them to connect to the corrcet PGDATABASE

How to do the above:

- Create two .env files. 
    One called .env.test and another called .env.development 

- Within each .env file please change the process.env.PGDATABASE varible to the correct database.

- To set the PGDATABSE please write the following 

    ``` PGDATABASE=name_of_database ```

For more clarity on what this is doing, please look at the connection.js file within the seeds directory.

## key steps 

- 1. Please clone the repo from github by copying the url into your terminal in this format
``` git clone <url> ``` 

- 2. The next step is to install the dependencies. To do this please type the following command into your terminal,
``` npm install ```

- 3. Next, please seed your local database. To do this please run the setup.sql file by using the command 
``` npm run setup-dbs ```
    Once this is complete, please run the next command to seed the development database,
``` npm run seed ```
    In order to run tests on this API and use test data, please look at the "mainTestSuite.test.js" to gain a further understanding on how the test_database is seeded and interacted with. To initialise the test database and suite please run the command, 
``` npm t main ```

## Versions
Requires min Node version of 10.2.4 and Posgres 15.5


