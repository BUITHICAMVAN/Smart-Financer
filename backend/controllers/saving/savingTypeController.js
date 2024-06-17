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

exports.addSavingType = async (req, res) => {
    const { saving_type_name } = req.body;

    try {
        if (!saving_type_name) {
            return res.status(400).json({ message: 'Saving type name is required' });
        }

        const newSavingType = await SavingType.create({ saving_type_name });
        res.status(201).json(newSavingType);
    } catch (error) {
        console.error('Failed to add saving type:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateSavingType = async (req, res) => {
    const { saving_type_id } = req.params;
    const { saving_type_name } = req.body;

    try {
        const typeId = parseInt(saving_type_id, 10);
        if (isNaN(typeId)) {
            return res.status(400).json({ message: 'Invalid saving type ID' });
        }

        const savingType = await SavingType.findByPk(typeId);
        if (!savingType) {
            return res.status(404).json({ message: 'Saving type not found' });
        }

        savingType.saving_type_name = saving_type_name;
        await savingType.save();

        res.json(savingType);
    } catch (error) {
        console.error('Failed to update saving type:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllSavingTypes = async (req, res) => {
    try {
        const savingTypes = await SavingType.findAll({
            attributes: ['saving_type_id', 'saving_type_name'],
            order: [['saving_type_id', 'ASC']] // Order the results by saving_type_id
        });
        res.json(savingTypes);
    } catch (error) {
        console.error('Failed to fetch all saving types:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};