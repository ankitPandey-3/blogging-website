import { Router } from "express";
import { getSignup, getLogin, postSignup, postLogin } from "../controllers/user.controller.js";

const router = Router();

router.route('/signup')
        .get(getSignup)
        .post(postSignup);

router.route('/login')
        .get(getLogin)
        .post(postLogin);

export default router;  