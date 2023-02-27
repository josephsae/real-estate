import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";

import { generateId, generateJWT } from "../helpers/tokens.js";
import { emailRegister, emailForgetPassword } from "../helpers/emails.js";
import User from "../models/User.js";

const loginForm = (req, res) => {
    res.render("auth/login", {
        page: "Log In",
        csrfToken: req.csrfToken()
    });
};

const authenticate = async (req, res) => {
    await check("email").notEmpty().withMessage("email is required").run(req);
    await check("email").isEmail().withMessage("invalid email").run(req);
    await check("password").notEmpty().withMessage("password is required").run(req);

    let result = validationResult(req);
    if (!result.isEmpty()) {
        return res.render("auth/login", {
            page: "Log In",
            csrfToken: req.csrfToken(),
            errors: result.array(),
        });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.render("auth/login", {
            page: "Log In",
            csrfToken: req.csrfToken(),
            errors: [{ msg: "the user doesn't exist" }]
        });
    }

    if (!user.confirmed) {
        return res.render("auth/login", {
            page: "Log In",
            csrfToken: req.csrfToken(),
            errors: [{ msg: "your account hasn't been confirmed" }]
        });
    }

    if (!user.verifyPassword(password)) {
        return res.render("auth/login", {
            page: "Log In",
            csrfToken: req.csrfToken(),
            errors: [{ msg: "Password is incorrect" }]
        });
    }

    const { name, id } = user;
    const token = generateJWT({ name, id });

    return res.cookie("_token", token, {
        httpOnly: true,
        // secure: true
    }).redirect("/my-properties");
};

const signOff = (req, res) => {
    return res.clearCookie("_token").status(200).redirect("/auth/login");
};

const registrationForm = (req, res) => {
    res.render("auth/register", {
        page: "Create Account",
        csrfToken: req.csrfToken()
    });
};

const register = async (req, res) => {
    const { name, email, password } = req.body;
    await check("name").notEmpty().withMessage("name can not be empty").run(req);
    await check("email").isEmail().withMessage("invalid email").run(req);
    await check("password").isLength({ min: 8 }).withMessage("password must be at least 8 characters").run(req);
    await check("repeat_password").equals(req.body.password).withMessage("passwords do not match").run(req);

    let result = validationResult(req);
    if (!result.isEmpty()) {
        return res.render("auth/register", {
            page: "Create Account",
            csrfToken: req.csrfToken(),
            errors: result.array(),
            user: {
                name,
                email
            }
        });
    }

    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
        return res.render("auth/register", {
            page: "Create Account",
            csrfToken: req.csrfToken(),
            errors: [{ msg: "user is already registered." }],
            user: {
                name,
                email
            }
        });
    }

    const user = await User.create({
        name,
        email,
        password,
        token: generateId()
    });

    emailRegister({
        name: user.name,
        email: user.email,
        token: user.token
    });

    res.render("templates/message", {
        page: "Account created successfully",
        message: "We send you an email to confirm your account."
    });
};

const confirm = async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({ where: { token } });

    if (!user) {
        return res.render("auth/confirm-account", {
            page: "Error confirming your account",
            message: "An error occurred while confirming your account, please try again",
            error: true
        })
    }

    user.token = null;
    user.confirmed = true;

    await user.save();

    res.render("auth/confirm-account", {
        page: "Account confirmed",
        message: "The account was confirmed successfully",
        error: false
    });
};

const forgetPasswordForm = (req, res) => {
    res.render("auth/forgot-password", {
        page: "Recover your access to Real Estate",
        csrfToken: req.csrfToken()
    });
};

const resetPassword = async (req, res) => {
    await check("email").notEmpty().withMessage("email is required").run(req);
    await check("email").isEmail().withMessage("invalid email").run(req);

    let result = validationResult(req);
    if (!result.isEmpty()) {
        return res.render("auth/forgot-password", {
            page: "Recover your access to Real Estate",
            csrfToken: req.csrfToken(),
            errors: result.array(),
        });
    }

    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.render("auth/forgot-password", {
            page: "Recover your access to Real Estate",
            csrfToken: req.csrfToken(),
            errors: [{ msg: "email does not belong to any user" }],
        });
    }

    user.token = generateId();
    await user.save();

    emailForgetPassword({
        email: user.email,
        name: user.name,
        token: user.token
    });

    res.render("templates/message", {
        page: "Reset your password",
        message: "We send an email with the instructions."
    });
};

const checkToken = async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({ where: { token } });
    if (!user) {
        return res.render("auth/confirm-account", {
            page: "Error reset your password",
            message: "An error occurred while reset your password, please try again",
            error: true
        })
    }

    res.render("auth/reset-password", {
        page: "Reset your password",
        csrfToken: req.csrfToken()
    });
};

const newPassword = async (req, res) => {
    const { password } = req.body;
    await check("password").isLength({ min: 8 }).withMessage("password must be at least 8 characters").run(req);
    await check("repeat_password").equals(password).withMessage("passwords do not match").run(req);

    let result = validationResult(req);
    if (!result.isEmpty()) {
        return res.render("auth/reset-password", {
            page: "Reset your password",
            csrfToken: req.csrfToken(),
            errors: result.array(),
        });
    }

    const { token } = req.params;

    const user = await User.findOne({ where: { token } });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.token = null;

    await user.save();

    res.render("auth/confirm-account", {
        page: "Password reset",
        message: "Password saved successfully",
        csrfToken: req.csrfToken()
    });
};

export {
    loginForm,
    authenticate,
    signOff,
    registrationForm,
    register,
    forgetPasswordForm,
    confirm,
    resetPassword,
    checkToken,
    newPassword,
}