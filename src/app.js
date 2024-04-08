import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express();

//import routes
import USERROUTE from './routes/user.routes.js'


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static(path.resolve("./public"))); // Update static file path
app.use(cookieParser())

app.set("view engine", "ejs");
app.set("views", path.resolve("./src/views"));

app.get('/',(req,res)=>{
    return res.render('home.ejs');
})

app.use('/user', USERROUTE);

export { app };
