import jwt from "jsonwebtoken";
import User from "../models/User.js";

const identifyUser = async (req, res, next) => {
    const { _token: token } = req?.cookies;
    if (!token) {
        req.user = null;
        return next();
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.scope("deletePassword").findByPk(decoded.id);

        if (user) {
            req.user = user;
        }
        return next();
    } catch (error) {
        console.log(error);
        return res.cleanCookie("_token").redirect("/auth/login");
    }

};

export default identifyUser