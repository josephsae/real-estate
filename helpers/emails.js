import nodemailer from "nodemailer";

const emailRegister = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    const {email, name, token} = data;

    await transport.sendMail({
        from: "RealEstates.com",
        to: email,
        subject: "Confirm your account at RealEstates.com",
        text : "Confirm your account at RealEstates.com",
        html: `
            <p>Hi ${name}, check your account at RealEstates.com</p>

            <p>Your account is ready, you just have to confirm in the following link:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}">Confirm account</a> </p>

            <p>If you didn't create this account, you can ignore the message.</p>
        `
    })
};

const emailForgetPassword = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    const {email, name, token} = data;

    await transport.sendMail({
        from: "RealEstates.com",
        to: email,
        subject: "Reset your password at RealEstates.com",
        text : "Reset your password at RealEstates.com",
        html: `
            <p>Hi ${name}, you have requested to reset your password at RealEstates.com</p>

            <p>Follow the link below to generate a new password:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/forgot-password/${token}">Reset Password</a> </p>

            <p>If you didn't request to change your password, you can ignore the message.</p>
        `
    })

};

export {
    emailRegister,
    emailForgetPassword
}