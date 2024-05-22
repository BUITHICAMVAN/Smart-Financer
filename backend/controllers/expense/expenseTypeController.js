
exports.addExpense = async (req, res) => {
    const { expense_note, expense_amount, expense_type_id, expense_create_at} = req.body

     // Corrected data validations to match the model fields
     if (!expense_amount || !expense_type_id) {
        return res.status(400).json({ message: 'Amount and type are required!' });
    }

    if (expense_amount <= 0 || typeof expense_amount !== 'number') {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
    }

    const expenseTypeExist = await expenseType.findOne({ // check if type exists 
        where: { expense_type_id: expense_type_id }
    })

    if (!expenseTypeExist) {
        return res.status(404).json({ message: 'expense type does not exist!' });
    }
    const expense = new expense({
        expense_user_id: req.user.user_id,
        expense_amount,
        expense_type_id,
        expense_note, // Added support for expense_note
        expense_created_at: expense_created_at || new Date()
    });

    try {
        await expense.save();
        res.status(201).json({ message: 'expense Added', data: expense });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

exports.getExpenses = async (req, res) => {
}

exports.updateExpense = async (req, res) => {

}

exports.deleteExpense = async (req, res) => {

}