const Due = require("../models/due/dueModel");
const DueType = require("../models/due/dueTypeModel");
const DueStatus = require("../models/due/dueStatusModel");

exports.addDue = async (req, res) => {
    const { due_amount, due_type_id, due_details, due_due_date } = req.body;
    const initialDueStatusId = 2; // Assuming '2' is the ID for 'pending' status

    if (!due_amount || !due_type_id || !due_due_date) {
        return res.status(400).json({ message: 'Amount, type, and due date are required!' });
    }

    if (due_amount <= 0 || typeof due_amount !== 'number') {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
    }

    const dueTypeExist = await DueType.findByPk(due_type_id);
    if (!dueTypeExist) {z
        return res.status(404).json({ message: 'Due type does not exist!' });
    }

    // Validate due status id exists
    const dueStatusExist = await DueStatus.findByPk(initialDueStatusId);
    if (!dueStatusExist) {
        return res.status(404).json({ message: 'Initial due status not set correctly in the system.' });
    }

    const due = new Due({
        due_user_id: req.user.user_id,
        due_date: new Date(), // Current date as creation date
        due_due_date,
        due_details,
        due_amount,
        due_type_id,
        due_status_id: initialDueStatusId
    });

    try {
        await due.save();
        res.status(201).json({ message: 'Due added', data: due });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.getDues = async (req, res) => {
    try {
        const dues = await Due.findAll({
            where: { due_user_id: req.user.user_id },
            include: [DueType, DueStatus],
            order: [['due_date', 'DESC']]
        });
        res.status(200).json(dues);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.deleteDue = async (req, res) => {
    const { due_id } = req.params;
    try {
        const result = await Due.destroy({
            where: { due_id: due_id, due_user_id: req.user.user_id }
        });
        if (result === 0) {
            return res.status(404).json({ message: 'Due not found or not authorized to delete' });
        }
        res.status(200).json({ message: 'Due deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.updateDue = async (req, res) => {
    const { due_id } = req.params;
    const { due_amount, due_due_date, due_details, due_type_id, due_status_id } = req.body;

    try {
        const due = await Due.findByPk(due_id);
        if (!due || due.due_user_id !== req.user.user_id) {
            return res.status(404).json({ message: 'Due not found or you do not have permission to update it' });
        }

        due.due_amount = due_amount;
        due.due_type_id = due_type_id;
        due.due_details = due_details;
        due.due_due_date = due_due_date || due.due_due_date;
        due.due_status_id = due_status_id || due.due_status_id;
        await due.save();

        res.status(200).json({ message: 'Due updated', data: due });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
