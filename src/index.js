import dotenv from "dotenv";
import connectionDB from "./conection.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})

connectionDB()
            .then(()=>{
                app.listen(process.env.PORT || 8000, ()=>{
                    console.log(`Server is running on ${process.env.PORT}`);
                })
            })
            .catch((error)=>{
                console.log('MongoDB connection Failes !!! ', error);
            })
