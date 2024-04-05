const User = require("../models/userModel");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

// const getSurname = (fullname) => {
//     // first word is surname for vietnamese name
//     return fullname.split(" ")[0];
// }

// const getFirstname = (fullname) => {
//     // last word is firstname for vietnamese name
//     return fullname.split(" ").slice(-1)[0];
// }

exports.signup = async (req, res) => {
    const { user_fullname, user_email, user_password_hash, user_image, user_currency_unit } = req.body;
    try {
        const hashPassword = bcrypt.hashSync(user_password_hash, 15);
        // Here, you might want to hash the password before saving
        const newUser = await User.create({
            user_fullname,
            // user_surname: getSurname(user_fullname),
            // user_firstname: getSurname(user_fullname),
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
    // console.log(req.body);
    try {
        const validUser = await User.scope('withPassword').findOne({ where: { user_email } });
        // console.log(validUser)
        if (!validUser) return next(errorHandler(404, "User not found!"));
        const validPassword = bcrypt.compareSync(user_password, validUser.user_password_hash);
        // console.log(validPassword)
        if (!validPassword) return next(errorHandler(401, "Wrong password!"));
        const token = jwt.sign({ user_id: validUser.user_id }, process.env.SECRET_KEY);
        res.cookie('access_token', token, { httpOnly: true }).status(200).json({
            validUser,
            cookie: token,
        });
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

        // Assuming transporter is defined somewhere in your code.
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
    // Respond to the client that the sign-out was successful
    res.status(200).json({ message: 'Successfully signed out' });
};
