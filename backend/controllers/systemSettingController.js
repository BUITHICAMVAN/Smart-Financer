const SystemSetting = require("../models/systemSettingModel"); // Ensure correct path

// Get system settings
exports.getSystemSetting = async (req, res) => {
    try {
        const settings = await SystemSetting.findAll(); 
        res.status(200).json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Update system settings
exports.updateSystemSetting = async (req, res) => {
    const { setting_id } = req.params; 
    const { currency_unit, default_language } = req.body; // And other fields as necessary

    try {
        const settings = await SystemSetting.findByPk(setting_id);
        if (!settings) {
            return res.status(404).json({ message: 'Settings not found' });
        }

        // Update fields
        settings.currency_unit = currency_unit || settings.currency_unit;
        settings.default_language = default_language || settings.default_language;
        // Add other fields as necessary

        await settings.save();
        res.status(200).json({ message: 'Settings updated successfully', settings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};