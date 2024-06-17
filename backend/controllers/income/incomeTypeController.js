const Income = require("../../models/income/incomeModel");
const IncomeType = require("../../models/income/incomeTypeModel");
const IncomeTypeModel = require("../../models/income/incomeTypeModel");
const User = require("../../models/userModel");

exports.getUserIncomeTypes = async (req, res) => {
    try {
        // check if user is a passed in a valid id as an integer or not
        if (!Number.isInteger(req.user.user_id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const userIncomesWithTypes = await Income.findAll({
            where: { income_user_id: req.user.user_id }, // Filter incomes by the logged-in user's ID
            include: [{
                model: IncomeType,
                attributes: ['income_type_id', 'income_type_name'], // Fetch specific attributes of IncomeType
            }],
            order: [['income_type_id', 'ASC']] // Order the results by income_type_id
        });

        const incomeTypeAttributes = userIncomesWithTypes.map(income => {
            return income.IncomeType; // This will give you an array of IncomeType objectsj7
        });
        res.json(incomeTypeAttributes);

    } catch (error) {
        console.error('Failed to fetch income types:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.addIncomeType = async (req, res) => {
    const { income_type_name } = req.body;

    try {
        if (!income_type_name) {
            return res.status(400).json({ message: 'Income type name is required' });
        }

        const newIncomeType = await IncomeType.create({ income_type_name });
        res.status(201).json(newIncomeType);
    } catch (error) {
        console.error('Failed to add income type:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateIncomeType = async (req, res) => {
    const { income_type_id } = req.params;
    const { income_type_name } = req.body;

    try {
        const typeId = parseInt(income_type_id, 10);
        if (isNaN(typeId)) {
            return res.status(400).json({ message: 'Invalid income type ID' });
        }

        const incomeType = await IncomeType.findByPk(typeId);
        if (!incomeType) {
            return res.status(404).json({ message: 'Income type not found' });
        }

        incomeType.income_type_name = income_type_name;
        await incomeType.save();

        res.json(incomeType);
    } catch (error) {
        console.error('Failed to update income type:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllIncomeTypes = async (req, res) => {
    try {
        const incomeTypes = await IncomeType.findAll({
            attributes: ['income_type_id', 'income_type_name'],
            order: [['income_type_id', 'ASC']] // Order the results by income_type_id
        });
        res.json(incomeTypes);
    } catch (error) {
        console.error('Failed to fetch all income types:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};