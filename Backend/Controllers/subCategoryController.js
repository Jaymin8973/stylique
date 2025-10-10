const SubCategory = require('../Models/SubCategory');

exports.createSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.create(req.body);
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.findAll({
      include: 'Category'
    });
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findByPk(req.params.id, {
      include: 'Category'
    });
    if (subCategory) res.json(subCategory);
    else res.status(404).json({ error: 'SubCategory not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    const [updated] = await SubCategory.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedSubCat = await SubCategory.findByPk(req.params.id);
      res.json(updatedSubCat);
    } else {
      res.status(404).json({ error: 'SubCategory not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const deleted = await SubCategory.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'SubCategory deleted successfully' });
    else res.status(404).json({ error: 'SubCategory not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
