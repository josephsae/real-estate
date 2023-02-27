import express from "express";
import { home, category, notFound, search } from "../controllers/app-controller.js";

const router = express.Router();

router.get("/", home);

router.get("/category/:id", category);

router.get("/404", notFound);

router.post("/search", search);


export default router;