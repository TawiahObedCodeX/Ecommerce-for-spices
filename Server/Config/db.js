import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    database:process.env.DB_NAME,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD
})
// connection to the database
pool.on("database connection",()=>{
   console.log("connected to database successfully")
})

// error for the connection
pool.on("error connection",()=>{
    console.error("unexpected error on idle client");
    process.exit(-1);
})