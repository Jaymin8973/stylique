
const SubCategory = require('../Models/SubCategory');


exports.getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.findAll();
        res.json(subCategories);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};