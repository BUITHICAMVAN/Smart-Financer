const Saving = require("../../models/saving/savingModel");
const SavingType = require("../../models/saving/savingTypeModel");

exports.getUserSavingTypes = async (req, res) => {
    try {
        // check if user is a passed in a valid id as an integer or not
        if (!Number.isInteger(req.user.user_id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const usersavingsWithTypes = await Saving.findAll({
            where: { saving_user_id: req.user.user_id }, // Filter savings by the logged-in user's ID
            include: [{
                model: SavingType,
                attributes: ['saving_type_id', 'saving_type_name'], // Fetch specific attributes of savingType
            }],
            order: [['saving_type_id', 'ASC']] // Order the results by saving_type_id
        });
        
        const savingTypeAttributes = usersavingsWithTypes.map(saving => {
            return saving.SavingType; // This will give you an array of savingType objectsj7
        });
        res.json(savingTypeAttributes);

    } catch (error) {
        console.error('Failed to fetch saving types:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}