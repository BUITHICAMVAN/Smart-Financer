const Budget = require("../../models/budget/budgetModel");
const BudgetType = require("../../models/budget/budgetTypeModel");
const User = require("../../models/userModel");

exports.addBudget = async (req, res) => {
    const { budget_budget_type_id, budget_related_id, budget_related_type, budget_amount, budget_date } = req.body;

    // Validate input data
    if (!budget_budget_type_id || !budget_related_id || !budget_related_type || !budget_amount || !budget_date) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    if (budget_amount <= 0 || typeof budget_amount !== 'number') {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
    }

    // Create the new budget
    const budget = new Budget({
        budget_user_id: req.user.user_id,
        budget_budget_type_id,
        budget_related_id,
        budget_related_type,
        budget_amount,
        budget_date
    });

    try {
        await budget.save();
        res.status(201).json({ message: 'Budget Added', data: budget });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.findAll({
            where: { budget_user_id: req.user.user_id },
            include: [
                {
                    model: BudgetType,
                    attributes: ['budget_type_id', 'budget_type_name']
                }
            ],
            order: [['budget_date', 'DESC']]
        });
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.updateBudget = async (req, res) => {
    const { budget_id } = req.params;
    const { budget_amount } = req.body;

    if (!budget_amount || budget_amount <= 0 || typeof budget_amount !== 'number') {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
    }

    try {
        const budget = await Budget.findOne({ where: { budget_id: budget_id, budget_user_id: req.user.user_id } });
        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        budget.budget_amount = budget_amount;
        await budget.save();

        res.status(200).json({ message: 'Budget updated', data: budget });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.deleteBudget = async (req, res) => {
    const { budget_id } = req.params;
    try {
        const result = await Budget.destroy({
            where: {
                budget_id: budget_id,
                budget_user_id: req.user.user_id // Ensure ownership
            }
        });
        if (result === 0) {
            return res.status(404).json({ message: 'Budget not found or not authorized' });
        }
        res.status(200).json({ message: 'Budget Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
