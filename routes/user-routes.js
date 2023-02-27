import express from "express";
import {
    loginForm,
    authenticate,
    signOff,
    registrationForm,
    register,
    forgetPasswordForm,
    confirm,
    resetPassword,
    checkToken,
    newPassword
} from "../controllers/user-controller.js";

const router = express.Router();

router.get("/login", loginForm);
router.post("/login", authenticate);

router.post("/sign-off", signOff);

router.get("/register", registrationForm);
router.post("/register", register);

router.get("/confirm/:token", confirm);

router.get("/forgot-password", forgetPasswordForm);
router.post("/forgot-password", resetPassword);

router.get("/forgot-password/:token", checkToken);
router.post("/forgot-password/:token", newPassword);

export default router;



