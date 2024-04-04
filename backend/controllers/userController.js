const User = require("../models/userModel"); // Adjust the path as necessary

exports.createUser = async (req, res) => {
    const { user_fullname, user_email, user_password_hash, user_image, user_currency_unit } = req.body;
    try {
        // Here, you might want to hash the password before saving
        const newUser = await User.create({
            user_fullname,
            user_email,
            user_password_hash, // Ensure this is hashed
            user_image,
            user_currency_unit
        });

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.getUserDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll()
        res.status(200).json(users); // users and status as response
    } catch {
        console.error('Failed to fetch users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
}

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { user_fullname, user_image, user_currency_unit } = req.body;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.user_fullname = user_fullname || user.user_fullname;
        user.user_image = user_image || user.user_image;
        user.user_currency_unit = user_currency_unit || user.user_currency_unit;

        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.deleteUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await User.destroy({
            where: { user_id }
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
