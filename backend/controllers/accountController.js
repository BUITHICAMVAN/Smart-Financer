const Account = require("../models/accountModel"); // Ensure correct path

// Create a new account
exports.createAccount = async (req, res) => {
    const { account_type, account_expires_at } = req.body; // Add other necessary fields
    try {
        const account = await Account.create({
            account_user_id: req.user.id, // Assuming you have middleware to set req.user
            account_type,
            account_expires_at,
            // Other fields as necessary
        });

        res.status(201).json({ message: 'Account created successfully', account });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Get account details
exports.getAccountDetails = async (req, res) => {
    const { account_id } = req.params;
    try {
        const account = await Account.findByPk(account_id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json(account);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Update an account
exports.updateAccount = async (req, res) => {
    const { account_id } = req.params;
    const { account_type, account_expires_at } = req.body; // Add other fields as necessary

    try {
        const account = await Account.findByPk(account_id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Update fields
        account.account_type = account_type || account.account_type;
        account.account_expires_at = account_expires_at || account.account_expires_at;
        // Add other fields as necessary

        await account.save();
        res.status(200).json({ message: 'Account updated successfully', account });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Delete an account
exports.deleteAccount = async (req, res) => {
    const { account_id } = req.params;
    try {
        const result = await Account.destroy({ where: { account_id } });
        if (result === 0) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};
