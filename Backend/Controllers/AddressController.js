const Address = require('../Models/Address');
const User = require("../Models/User");

exports.getAddressesbyEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const addresses = await Address.findAll({ where: { user_id: user.user_id } });
        res.status(200).json(addresses);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.addAddress = async (req, res) => {
    const { email, firstName, lastName, mobileNumber, pincode, houseNo, street, city, state, addressType } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const addressCount = await Address.count({ where: { user_id: user.user_id } });

        const newAddress = await Address.create({
            user_id: user.user_id,
            firstName,
            lastName,
            mobileNumber,
            pincode,
            houseNo,
            street,
            city,
            state,
            addressType,
            selected: addressCount == 0
        });

        res.status(201).json(newAddress);
    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.UpdateSelected = async (req, res) => {
    const { address_id, email } = req.body;

    const user = await User.findOne({ where: { email } });

    try {
        await Address.update(
            { selected: false },
            { where: { user_id: user.user_id } }
        );

        const Select = await Address.findOne({ where: { address_id } });

        Select.selected = true;
        await Select.save();

        res.status(200).json(Select);
    } catch (error) {
        console.error('Error updating address selection:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}