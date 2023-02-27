import path from "path";

export default {
    mode: "development",
    entry: {
        map: "./src/js/map.js",
        "add-image": "./src/js/add-image.js",
        "show-map": "./src/js/show-map.js",
        "home-map": "./src/js/home-map.js",
        "update-status": "./src/js/update-status.js"

    },
    output: {
        filename: "[name].js",
        path: path.resolve("public/js")
    }
}