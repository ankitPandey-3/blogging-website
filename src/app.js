import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { checkAuth } from './middlewares/auth.middleware.js';
import { blogs } from './models/blogs.model.js';

const app = express();

//import routes
import USERROUTE from './routes/user.routes.js';
import BLOGROUTE from './routes/blog.route.js';

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static(path.resolve("./public"))); // Update static file path
app.use(cookieParser())
app.use(checkAuth);


app.set("view engine", "ejs");
app.set("views", path.resolve("./src/views"));

app.get('/', async(req,res)=>{
    const allBlogs = await blogs.find({}).populate('createdBy')
    if(req.user){
        return res.render('home.ejs',{
            user: req.user,
            blogs: allBlogs
        })
    }
    else{
        return res.render('home.ejs',{
            user: undefined,
            blogs: allBlogs
        })
    }
})



app.use('/user', USERROUTE);
app.use('/blog', BLOGROUTE);
export { app };
