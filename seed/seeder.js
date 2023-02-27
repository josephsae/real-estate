import { exit } from "node:process";
import categories from "./categories.js";
import prices from "./prices.js";
import users from "./users.js";
import db from "../config/db.js";
import { Category, Price, User } from "../models/index.js";

const importData = async () => {
    try {
        await db.authenticate();
        await db.sync();
        await Promise.all([
            Category.bulkCreate(categories),
            Price.bulkCreate(prices),
            User.bulkCreate(users)
        ])
        console.log("Data imported successfully");
        exit();
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

const deleteData = async () => {
    try {
        await db.sync({ force: true });
        console.log("Data deleted successfully");
        exit();
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

if (process.argv[2] === "-i") {
    importData();
}

if (process.argv[2] === "-e") {
    deleteData();
}