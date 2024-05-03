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