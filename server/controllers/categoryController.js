const Category = require('../models/Category');
const KPI = require('../models/KPI');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    // Get KPI count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const kpiCount = await KPI.countDocuments({ category: category._id });
        return {
          ...category.toObject(),
          kpiCount
        };
      })
    );

    res.json({
      success: true,
      count: categories.length,
      data: categoriesWithCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single category
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Get associated KPIs
    const kpis = await KPI.find({ category: req.params.id });

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        kpis
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    // Check if category has KPIs
    const kpiCount = await KPI.countDocuments({ category: req.params.id });

    if (kpiCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete category with ${kpiCount} associated KPIs`
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
