import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";



const Server = express();

// middleware
Server.use(express.json());
Server.use(cookieParser());

// testing
Server.get("/", (req, res) => {
  res.send(`Hello world try out Melo's Spices , it's still on work`);
});

const Port = process.env.PORT || 5000;

Server.listen(Port, "0.0.0.0", () => {
  console.log(`server is running at http://localhost:${Port}`);
});
