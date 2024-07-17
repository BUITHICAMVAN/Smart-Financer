const Income = require("../../models/income/incomeModel");
const IncomeType = require("../../models/income/incomeTypeModel");

exports.addIncome = async (req, res) => {
    const { income_amount, income_type_id, income_note, income_created_at } = req.body;

    // Corrected data validations to match the model fields
    if (!income_amount) {
        return res.status(400).json({ message: 'Amount are required!' });
    }

    if (income_amount <= 0 || typeof income_amount !== 'number') {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
    }

    if (income_type_id) {
        const incomeTypeExist = await IncomeType.findOne({
            where: { income_type_id: income_type_id }
        })

        if (!incomeTypeExist) {
            return res.status(404).json({ message: 'Income type does not exist!' });
        }
    }
    const income = new Income({
        income_user_id: req.user.user_id,
        income_amount,
        income_type_id,
        income_note, // Added support for income_note
        income_created_at: income_created_at || new Date()
    });

    try {
        await income.save();
        res.status(201).json({ message: 'Income Added', data: income });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.getIncomes = async (req, res) => {
    try {
        const incomes = await Income.findAll({
            where: { income_user_id: req.user.user_id },
            order: [['income_created_at', 'DESC']]
        });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.deleteIncome = async (req, res) => {
    const { income_id } = req.params;
    try {
        const result = await Income.destroy({
            where: {
                income_id: income_id,
                income_user_id: req.user.user_id // Ensure ownership
            }
        });
        if (result === 0) {
            return res.status(404).json({ message: 'Income not found or not authorized' });
        }
        res.status(200).json({ message: 'Income Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.updateIncome = async (req, res) => {
    const { income_id } = req.params;
    const { income_amount, income_created_at, income_note, income_type_id } = req.body;

    try {
        const income = await Income.findOne({ where: { income_id: income_id, income_user_id: req.user.user_id } });
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }
        income.income_amount = income_amount;
        income.income_type_id = income_type_id;
        income.income_note = income_note;
        income.income_created_at = income_created_at || income.income_created_at;
        await income.save();

        res.status(200).json({ message: 'Income updated', data: income });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
