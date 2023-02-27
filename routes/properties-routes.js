import express from "express";
import { body } from "express-validator";
import {
    save,
    admin,
    create,
    addImage,
    storeImage,
    edit,
    saveChanges,
    remove,
    updatePropertyStatus,
    showProperty,
    sendMessage,
    showMessages
} from "../controllers/properties-controller.js";
import protectRoute from "../middleware/protect-route.js";
import upload from "../middleware/upload-image.js";
import identifyUser from "../middleware/identify-user.js";

const router = express.Router();

router.get(
    "/my-properties",
    protectRoute,
    admin
);

router.get(
    "/properties/create",
    protectRoute,
    create
);

router.post(
    "/properties/create",
    protectRoute,
    body("title")
        .notEmpty().withMessage("Property title is required"),
    body("description")
        .notEmpty().withMessage("Description can not be empty")
        .isLength({ max: 200 }).withMessage("Description is too long"),
    body("category")
        .isNumeric().withMessage("You have to select a category"),
    body("price")
        .isNumeric().withMessage("You have to select a price range"),
    body("bedrooms")
        .isNumeric().withMessage("You have to select a number of bedrooms"),
    body("bathrooms")
        .isNumeric().withMessage("You have to select a number of bathrooms"),
    body("parking_lots")
        .isNumeric().withMessage("You have to select a number of parking lots"),
    body("lat")
        .notEmpty().withMessage("You have to locate the property on the map"),
    save
);

router.get(
    "/properties/add-image/:id",
    protectRoute,
    addImage
);

router.post(
    "/properties/add-image/:id",
    protectRoute,
    upload.single("image"),
    storeImage
);

router.get(
    "/properties/edit/:id",
    protectRoute,
    edit
);

router.post(
    "/properties/edit/:id",
    protectRoute,
    body("title")
        .notEmpty().withMessage("Property title is required"),
    body("description")
        .notEmpty().withMessage("Description can not be empty")
        .isLength({ max: 200 }).withMessage("Description is too long"),
    body("category")
        .isNumeric().withMessage("You have to select a category"),
    body("price")
        .isNumeric().withMessage("You have to select a price range"),
    body("bedrooms")
        .isNumeric().withMessage("You have to select a number of bedrooms"),
    body("bathrooms")
        .isNumeric().withMessage("You have to select a number of bathrooms"),
    body("parking_lots")
        .isNumeric().withMessage("You have to select a number of parking lots"),
    body("lat")
        .notEmpty().withMessage("You have to locate the property on the map"),
    saveChanges
);

router.post(
    "/properties/remove/:id",
    protectRoute,
    remove
);

router.put(
    "/properties/:id",
    protectRoute,
    updatePropertyStatus
)

router.get(
    "/property/:id",
    identifyUser,
    showProperty
);

router.post(
    "/property/:id",
    identifyUser,
    body("message").isLength({min:20}).withMessage("The message cannot be empty or is very short "),
    sendMessage
);

router.get(
    "/messages/:id",
    protectRoute,
    showMessages
);

export default router;