import { Sequelize } from "sequelize";
import { Price, Category, Property } from "../models/index.js";

const home = async (req, res) => {

    const [categories, prices, houses, departments] = await Promise.all([
        Category.findAll({ raw: true }),
        Price.findAll({ raw: true }),
        Property.findAll({
            limit: 3,
            where: {
                categoryId: 1
            },
            include: [
                {
                    model: Price,
                    as: "price"
                }
            ],
            order: [
                ["createdAt", "DESC"]
            ]
        }),
        Property.findAll({
            limit: 3,
            where: {
                categoryId: 2
            },
            include: [
                {
                    model: Price,
                    as: "price"
                }
            ],
            order: [
                ["createdAt", "DESC"]
            ]
        })
    ]);

    res.render("home", {
        page: "Home",
        categories,
        prices,
        houses,
        departments,
        csrfToken: req.csrfToken()
    });
};

const category = async (req, res) => {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
        return res.redirect("/404")
    }

    const properties = await Property.findAll({
        where: {
            categoryId: id
        },
        include: [
            { model: Price, as: "price" }
        ]
    });

    res.render("category", {
        page: `${category.name}s for Sale`,
        properties,
        csrfToken: req.csrfToken()
    });
};

const notFound = (req, res) => {
    res.render("404", {
        page: "Not Found",
        csrfToken: req.csrfToken()
    })
};


const search = async (req, res) => {
    const { word } = req.body;
    if (!word.trim()) {
        return res.redirect("back");
    }

    const properties = await Property.findAll({
        where: {
            title: {
                [Sequelize.Op.like]: "%" + word + "%"
            }

        },
        include: [
            { model: Price, as: "price" }
        ]
    });

    res.render("search", {
        page: "Search Result",
        properties,
        csrfToken: req.csrfToken()
    })
};

export {
    home,
    category,
    notFound,
    search
};