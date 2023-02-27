import bcrypt from "bcrypt"

const users = [
    {
        name: "Joseph",
        email: "joseph@gmail.com",
        confirmed: true,
        password: bcrypt.hashSync("password", 10)
    }
];

export default users;