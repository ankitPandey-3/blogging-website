import { Router } from "express";
import { getSignup, getLogin, postSignup, postLogin, postLogout, myBlogs } from "../controllers/user.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/signup')
        .get(getSignup)
        .post(postSignup);

router.route('/login')
        .get(getLogin)
        .post(postLogin);

router.route('/logout')
        .get(postLogout);

router.route('/:id')
        .get(myBlogs)

export default router;  