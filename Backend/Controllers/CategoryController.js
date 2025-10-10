const Category = require('../Models/Category');

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if(category) res.json(category);
    else res.status(404).json({error: 'Category not found'});
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const [updated] = await Category.update(req.body, { where: { id: req.params.id }});
    if(updated){
      const updatedCategory = await Category.findByPk(req.params.id);
      res.json(updatedCategory);
    } else {
      res.status(404).json({error: 'Category not found'});
    }
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req,res) => {
  try {
    const deleted = await Category.destroy({ where: { id: req.params.id }});
    if(deleted) res.json({ message: 'Category deleted' });
    else res.status(404).json({error: 'Category not found'});
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
};
