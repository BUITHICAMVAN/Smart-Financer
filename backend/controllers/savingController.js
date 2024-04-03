const Saving = require("../models/savingModel"); // Adjust the path as necessary

exports.addSaving = async (req, res) => {
    const { saving_amount, saving_type_id, saving_note, saving_created_at } = req.body;

    if (!saving_amount || !saving_type_id) {
        return res.status(400).json({ message: 'Amount and type are required!' });
    }

    if (saving_amount <= 0 || typeof saving_amount !== 'number') {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
    }

    try {
        const saving = await Saving.create({
            saving_user_id: req.user.id,
            saving_amount,
            saving_type_id,
            saving_note,
            saving_created_at: saving_created_at || new Date()
        });

        res.status(201).json({ message: 'Saving Added', data: saving });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.getSavings = async (req, res) => {
    try {
        const savings = await Saving.findAll({
            where: { saving_user_id: req.user.id },
            order: [['saving_created_at', 'DESC']]
        });

        res.status(200).json(savings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.updateSaving = async (req, res) => {
    const { id } = req.params;
    const { saving_amount, saving_type_id, saving_note, saving_created_at } = req.body;

    if (!saving_amount || !saving_type_id) {
        return res.status(400).json({ message: 'Amount and type are required!' });
    }

    if (saving_amount <= 0 || typeof saving_amount !== 'number') {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
    }

    try {
        const saving = await Saving.findOne({
            where: {
                saving_id: id,
                saving_user_id: req.user.id
            }
        });

        if (!saving) {
            return res.status(404).json({ message: 'Saving not found' });
        }

        saving.saving_amount = saving_amount;
        saving.saving_type_id = saving_type_id;
        saving.saving_note = saving_note;
        if (saving_created_at) {
            saving.saving_created_at = saving_created_at;
        }

        await saving.save();
        res.status(200).json({ message: 'Saving updated', data: saving });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.deleteSaving = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Saving.destroy({
            where: {
                saving_id: id,
                saving_user_id: req.user.id
            }
        });

        if (result === 0) {
            return res.status(404).json({ message: 'Saving not found or not authorized' });
        }

        res.status(200).json({ message: 'Saving Deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};
