# Northcoders News API

In order to accsess the databases locally you must create your own .env files and update them to connect to the corrcet PGDATABASE

How to do the above:

- Create two .env files. 
    One called .env.test and another called .env.development 

- Within each .env file please change the process.env.PGDATABASE varible to the correct database.

- To set the PGDATABSE please write the following 

    ``` PGDATABASE=name_of_database ```

For more clarity on what this is doing, please look at the connection.js file within the seeds directory.
