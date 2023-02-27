import { unlink } from "node:fs";
import { Price, Category, Property, Message, User } from "../models/index.js";
import { validationResult } from "express-validator";
import { checkSellerStatus, formatDate } from "../helpers/index.js";

const admin = async (req, res) => {
    const { user = {}, query = {} } = req;
    const { page: actualPage } = query;

    const exp = /^[1-9]$/;

    if (!exp.test(actualPage)) {
        return res.redirect("/my-properties?page=1")
    }

    try {
        const { id } = user;
        const limit = 10;
        const offset = (actualPage * limit) - limit;

        const [properties, total] = await Promise.all([
            Property.findAll({
                limit,
                offset,
                where: {
                    userId: id
                },
                include: [
                    { model: Category, as: "category" },
                    { model: Price, as: "price" },
                    { model: Message, as: "messages" }
                ]
            }),
            Property.count({
                where: {
                    userId: id
                }
            })
        ]);
        res.render("properties/admin", {
            page: "My properties",
            csrfToken: req.csrfToken(),
            properties,
            pages: Math.ceil(total / limit),
            actualPage: Number(actualPage),
            total,
            offset,
            limit
        });
    } catch (error) {
        console.log(error);
    }
};

const create = async (req, res) => {
    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    res.render("properties/create", {
        page: "Create Property",
        csrfToken: req.csrfToken(),
        categories,
        prices,
        data: {}
    });
};

const save = async (req, res) => {
    let result = validationResult(req);
    if (!result.isEmpty()) {
        const [categories, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])

        return res.render("properties/create", {
            page: "Create Property",
            csrfToken: req.csrfToken(),
            categories,
            prices,
            errors: result.array(),
            data: req.body
        });
    }

    const {
        title,
        description,
        bedrooms,
        bathrooms,
        parking_lots,
        street,
        lat,
        lng,
        price: priceId,
        category: categoryId
    } = req.body;

    const { id: userId } = req.user;

    try {
        const savedProperty = await Property.create({
            title,
            description,
            bedrooms,
            bathrooms,
            parking_lots,
            street,
            lat,
            lng,
            priceId,
            categoryId,
            userId,
            image: "",
        });

        const { id } = savedProperty;
        res.redirect(`/properties/add-image/${id}`);

    } catch (error) {
        console.log(error)
    }
};

const addImage = async (req, res) => {
    const { params, user } = req;
    const { id } = params;

    const property = await Property.findByPk(id);

    if (!property) {
        return res.redirect("/my-properties");
    }

    if (property.published) {
        return res.redirect("/my-properties");
    }

    if (user.id.toString() !== property.userId.toString()) {
        return res.redirect("/my-properties");
    }

    res.render("properties/add-image", {
        page: "Add Image",
        csrfToken: req.csrfToken(),
        property
    });
};

const storeImage = async (req, res, next) => {
    const { params, user } = req;
    const { id } = params;

    const property = await Property.findByPk(id);

    if (!property) {
        return res.redirect("/my-properties");
    }

    if (property.published) {
        return res.redirect("/my-properties");
    }

    if (user.id.toString() !== property.userId.toString()) {
        return res.redirect("/my-properties");
    }

    try {
        property.image = req.file.filename;
        property.published = 1;

        await property.save();

        next();
    } catch (error) {
        console.log(error)
    }
};

const edit = async (req, res) => {
    const { id } = req.params;

    const property = await Property.findByPk(id);

    if (!property) {
        return res.redirect("/my-properties");
    }

    if (property.userId.toString() !== req.user.id.toString()) {
        return res.redirect("/my-properties");
    }

    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    res.render("properties/edit", {
        page: `Edit Property: ${property.title}`,
        csrfToken: req.csrfToken(),
        categories,
        prices,
        data: property
    });
};

const saveChanges = async (req, res) => {
    const { body, params } = req;
    let result = validationResult(req);
    if (!result.isEmpty()) {
        const [categories, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])

        return res.render("properties/edit", {
            page: "Edit Property",
            csrfToken: req.csrfToken(),
            categories,
            prices,
            errors: result.array(),
            data: body
        });
    }

    const { id } = params;

    const property = await Property.findByPk(id);

    if (!property) {
        return res.redirect("/my-properties");
    }

    if (property.userId.toString() !== req.user.id.toString()) {
        return res.redirect("/my-properties");
    }

    try {
        const {
            title,
            description,
            bedrooms,
            bathrooms,
            parking_lots,
            street,
            lat,
            lng,
            price: priceId,
            category: categoryId
        } = body;

        property.set({
            title,
            description,
            bedrooms,
            bathrooms,
            parking_lots,
            street,
            lat,
            lng,
            priceId,
            categoryId
        });

        await property.save();

        res.redirect("/my-properties");
    } catch (error) {
        console.log(error);
    }
};

const remove = async (req, res) => {
    const { params, user } = req;
    const { id } = params;

    const property = await Property.findByPk(id);

    if (!property) {
        return res.redirect("/my-properties");
    }

    if (property.userId.toString() !== user.id.toString()) {
        return res.redirect("/my-properties");
    }

    unlink(`public/uploads/${property.image}`, err => {
        if (err) console.log(err);
        else {
            console.log(`Image ${property.image} was removed`)
        }
    })

    try {
        await property.destroy();
        res.redirect("/my-properties");
    } catch (error) {
        console.log(error);
    }
};

const updatePropertyStatus = async (req, res) => {
    const { params, user } = req;
    const { id } = params;

    const property = await Property.findByPk(id);

    if (!property) {
        return res.redirect("/my-properties");
    }

    if (property.userId.toString() !== user.id.toString()) {
        return res.redirect("/my-properties");
    }

    property.published = !property.published;

    await property.save();

    res.json({
        result: true
    });
};

const showProperty = async (req, res) => {
    const { id } = req.params;

    const property = await Property.findByPk(id, {
        include: [
            { model: Category, as: "category" },
            { model: Price, as: "price" }
        ]
    });

    if (!property || !property.published) {
        return res.redirect("/404");
    }

    res.render("properties/show", {
        property,
        page: property.title,
        csrfToken: req.csrfToken(),
        user: req.user,
        isSeller: checkSellerStatus(req.user?.id, property.userId)
    })
};

const sendMessage = async (req, res) => {
    const { id: propertyId } = req.params;

    const property = await Property.findByPk(propertyId, {
        include: [
            { model: Category, as: "category" },
            { model: Price, as: "price" }
        ]
    });

    if (!property) {
        return res.redirect("/404");
    }

    let result = validationResult(req);
    if (!result.isEmpty()) {
        return res.render("properties/show", {
            property,
            page: property.title,
            csrfToken: req.csrfToken(),
            user: req.user,
            isSeller: checkSellerStatus(req.user?.id, property.userId),
            errors: result.array()
        });
    }

    const { message } = req.body;
    const { id: userId } = req.user;

    await Message.create({
        message,
        propertyId,
        userId
    });

    res.redirect("/");
};

const showMessages = async (req, res) => {
    const { params, user } = req;
    const { id } = params;

    const property = await Property.findByPk(id, {
        include: [
            {
                model: Message, as: "messages",
                include: [
                    { model: User.scope("deletePassword"), as: "user" }
                ]
            }
        ]
    });

    if (!property) {
        return res.redirect("/my-properties");
    }

    if (property.userId.toString() !== user.id.toString()) {
        return res.redirect("/my-properties");
    }

    res.render("properties/messages", {
        page: "Messages",
        messages: property.messages,
        formatDate
    })
};


export {
    admin,
    create,
    save,
    addImage,
    storeImage,
    edit,
    saveChanges,
    remove,
    updatePropertyStatus,
    showProperty,
    sendMessage,
    showMessages
}