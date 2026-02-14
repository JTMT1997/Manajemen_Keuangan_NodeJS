const Category = require('../models/Category');

// GET ALL
exports.getAllCategories = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const categories = userId
      ? await Category.findAll({ where: { userId } })
      : await Category.findAll();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// CREATE
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const userId = req.user?.id || null;

    const category = await Category.create({ name, userId });
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const userId = req.user?.id || null;
    const [updated] = await Category.update(
      { name },
      userId ? { where: { id, userId } } : { where: { id } }
    );
    if (!updated) return res.status(404).json({ error: 'Category not found' });

    res.json({ message: 'Category updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || null;
    const deleted = await Category.destroy(
      userId ? { where: { id, userId } } : { where: { id } }
    );
    if (!deleted) return res.status(404).json({ error: 'Category not found' });

    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
