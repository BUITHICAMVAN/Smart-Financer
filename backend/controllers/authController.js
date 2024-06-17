const User = require("../models/userModel");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

exports.refreshToken = (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) return res.status(401).json({ message: "Refresh Token is required." });

    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or expired refresh token." });

        const newAccessToken = jwt.sign({ user_id: user.user_id }, process.env.SECRET_KEY, { expiresIn: '15m' });
        res.status(200).json({
            accessToken: newAccessToken,
        });
    });
};

exports.signup = async (req, res) => {
    const { user_fullname, user_email, user_password_hash, user_image, user_currency_unit } = req.body;
    try {
        const hashPassword = bcrypt.hashSync(user_password_hash, 15);
        const newUser = await User.create({
            user_fullname,
            user_email,
            user_password_hash: hashPassword, // Ensure this is hashed
            user_image,
            user_currency_unit
        });
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        if (error.user_email === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.signin = async (req, res) => {
    const { user_email, user_password } = req.body;
    try {
        const validUser = await User.scope('withPassword').findOne({ where: { user_email } });
        if (!validUser) return res.status(404).json({ message: 'User not found' })

        const validPassword = bcrypt.compareSync(user_password, validUser.user_password_hash)
        if (!validPassword) return res.status(401).json({ message: 'Wrong password!' })

        const token = jwt.sign({ user_id: validUser.user_id }, process.env.SECRET_KEY);

        // res.cookie('access_token', token, { httpOnly: true }).status(200).json({
        //     validUser,
        //     cookie: token,
        // });
        res.cookie('access_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });

        res.status(200).json({
            message: 'Signin succesful',
            user: validUser,
            accessToken: token // return access token for client side 
        })
    } catch (error) {
        console.log("Signin error", error.message);
    }
};

exports.forgotpassword = async (req, res) => {
    try {
        const { user_email } = req.body;
        const validUser = await User.findOne({ where: { user_email } });
        if (!validUser) {
            return res.status(400).json({ message: 'No user created with this email!', email: user_email });
        }
        const token = jwt.sign({ id: validUser.user_id }, process.env.SECRET_KEY, { expiresIn: "15m" });
        const link = `localhost:3000/resetpassword/${validUser.user_id}/${token}`;

        const resetmail = {
            from: "onlinecvpr@hotmail.com",
            to: validUser.user_email,
            subject: "Reset password request",
            html: `<p>Your password can be reset by clicking the link below. The link will expire after 15 minutes.</p><p><a href="${link}">Reset Password</a></p><p>If you did not request this, please ignore this email.</p>`,
        };
        transporter.sendMail(resetmail);
        console.log(user_email, validUser.user_id, "reset password");
        res.status(200).json({ message: "A reset password link has been sent to your email to reset your password" });
    } catch (err) {
        console.log("Forgot password error", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.resetpassword = async (req, res) => {
    try {
        const { id, token } = req.params;
        const { password } = req.body;

        // Verify the token first
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token." });
            }

            const hashPassword = bcrypt.hashSync(password, 15);

            // Now update the user's password
            const update = await User.update({ user_password_hash: hashPassword }, { where: { user_id: id } });

            if (update[0] === 0) { // Check if the update operation affected any rows
                return res.status(500).json({ message: "Update failed, please try again later." });
            }

            res.status(200).json({ message: "You have successfully changed your password." });
        });
    } catch (err) {
        console.log("Reset password error", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.signout = (req, res) => {
    // Clear the authentication cookie
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    // Respond to the client that the sign-out was successful
    res.status(200).json({ message: 'Successfully signed out' });
};
