const dotenv = require('dotenv');
dotenv.config();
const { Pool } = require('pg');

const itemsPool = new Pool ({
   // user: 'postgres',
   // password: 'nocomment',
   // host: 'localhost',
   // port: 5432,
   // database: 'myrecipes'
    connectionString: process.env.DBConnectionString,
    ssl: {
        rejectUnauthorized: false
    }
});



module.exports = itemsPool;
