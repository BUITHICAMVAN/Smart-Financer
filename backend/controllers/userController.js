const User = require("../models/userModel"); // Adjust the path as necessary

// Get details of a specific user
exports.getUserDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Get details of all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Failed to fetch users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

// Update user details
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { user_fullname, user_image, user_currency_unit, user_need_ratio, user_want_ratio, user_saving_ratio, user_expected_income, user_default_language } = req.body;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.user_fullname = user_fullname || user.user_fullname;
        user.user_image = user_image || user.user_image;
        user.user_currency_unit = user_currency_unit || user.user_currency_unit;
        user.user_need_ratio = user_need_ratio || user.user_need_ratio;
        user.user_want_ratio = user_want_ratio || user.user_want_ratio;
        user.user_saving_ratio = user_saving_ratio || user.user_saving_ratio;
        user.user_expected_income = user_expected_income || user.user_expected_income;
        user.user_default_language = user_default_language || user.user_default_language;

        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};


// Delete a user
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await User.destroy({
            where: { user_id: id }
        });

        if (result === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Create a new user
exports.createUser = async (req, res) => {
    const { user_fullname, user_email, user_password_hash, user_image, user_currency_unit, user_need_ratio, user_want_ratio, user_saving_ratio, user_expected_income, user_default_language } = req.body;

    try {
        const newUser = await User.create({
            user_fullname,
            user_email,
            user_password_hash,
            user_image,
            user_currency_unit,
            user_need_ratio,
            user_want_ratio,
            user_saving_ratio,
            user_expected_income,
            user_default_language
        });

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};