# Hexagon Backend

Backend of the internship project

## Installation

### Requirements

-   nodejs
-   npm
-   mysql

### Steps

-   Clone the repository
-   `cd hexagon_backend`
-   `npm install`
-   Remove `example` from `config/config-variables.example.js` and set the variables
-   Run the mysql script to initialize the database. Scripts present in `hexagon_backend/MySQL/DbScripts.sql`
-   `npm run dev`

## API

### Base route

-   method: GET
-   `/api`
-   Gives a simple `Hello World` response, usefull to test the connection

### Upload route

-   method: POST
-   `/api/upload`
-   body: `file` (csv file) in json format specified in the frontend
-   response: `200` if the file is correctly uploaded, otherwise a `400` response.
    > Note: This route is triggered inside the frontend application, it is not necessary to use it manually and be careful while updating this.

### Table data route

-   method: GET
-   `/api/fetch`
-   body: query parameters tableName. Example: `/api/fetch?tableName=Test`
-   response: `200` with the data of the table in json format present in the database.
    > Note: This is the basic route to fetch data from specific table. To implement complex fetching, `fetch/<all_other_later>`route will have to be used.

## Limitations

1. SQL error while insertion of data in `subset` table

```
{
  code: 'ER_TRUNCATED_WRONG_VALUE',
  errno: 1292,
  sqlMessage: "Truncated incorrect DOUBLE value: 'cl_number'",
  sqlState: '22007',
  index: 0,
  sql: 'INSERT INTO subset_key_table (cl_number, core_tech_flag, platform_type)VALUES (123456,0,2)'
}
```

After resolving this error uncomment the function calls in `hexagon_backend/Controllers/fileData.js` line 11,12.

2. Storing data inside error tables, setting up all the funcitons to handle the error type of the module, performing bitwise operations, all are pending. This task is yet to cover in collaboration with the **Mr. Manhas Ujwal** .
