import express from "express";
import dotenv from "dotenv";
import { MongoConnect } from "./db.js";
import cors from 'cors'; 
import { shortRouter } from "./routes/short.js";
import { redirectRouter } from "./routes/redirect.js";
import { signUpRouter } from "./routes/signupUser.js";
import { loginRouter } from "./routes/loginUser.js";
import { dashRouter } from "./routes/dashboard.js";


//dotenv set up 

dotenv.config(); 

//database connection 

MongoConnect();

//initializing the server using express : 

const app = express(); 
const PORT = process.env.PORT

//middlewares 

app.use(express.json());
app.use(cors());

app.use("/", shortRouter); 
app.use("/", redirectRouter); 
app.use("/api/signup",signUpRouter); 
app.use("/api/login",loginRouter); 
app.use("/api/dash", dashRouter); 


app.listen(PORT, ()=>console.log(`App started in http://localhost:${PORT}`))

