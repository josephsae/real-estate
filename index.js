import express from "express";
import csrf from "csurf"
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user-routes.js"
import propertiesRoutes from "./routes/properties-routes.js";
import appRoutes from "./routes/app-routes.js";
import apiRoutes from "./routes/api-routes.js";
import db from "./config/db.js";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(csrf({ cookie: true }));

try {
    await db.authenticate();
    db.sync()
    console.log("Successful database connection");
} catch (error) {
    console.log(error);
}

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static("public"));

app.use("/", appRoutes);
app.use("/auth", userRoutes);
app.use("/", propertiesRoutes);
app.use("/api", apiRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})