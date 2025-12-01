const Sport = require('../models/Sport');
const Upload = require('../models/Upload');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalUploads = await Upload.countDocuments();
    const totalSports = await Sport.countDocuments();
    const activeSports = await Sport.countDocuments({ isActive: true });

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const recentUploads = await Upload.find()
      .sort({ uploadDate: -1 })
      .limit(10)
      .select('originalName uploadDate status recordCount')
      .populate('uploadedBy', 'name email');

    const uploadStats = await Upload.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      statistics: { totalUsers, totalUploads, totalSports, activeSports },
      usersByRole,
      recentUploads,
      uploadStats,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching dashboard statistics', 
      error: error.message 
    });
  }
};

exports.getAllSports = async (req, res) => {
  try {
    const { search, category, isActive } = req.query;
    let query = {};

    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const sports = await Sport.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      count: sports.length,
      sports,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching sports', 
      error: error.message 
    });
  }
};

exports.getSportById = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id).populate('createdBy', 'name email');

    if (!sport) {
      return res.status(404).json({ 
        success: false,
        message: 'Sport not found' 
      });
    }

    res.json({ success: true, sport });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching sport', 
      error: error.message 
    });
  }
};

exports.createSport = async (req, res) => {
  try {
    const { name, category, description, rulesLink, popularity } = req.body;

    if (!name || !category || !description) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide name, category, and description' 
      });
    }

    const existingSport = await Sport.findOne({ name: name.trim() });
    if (existingSport) {
      return res.status(400).json({ 
        success: false,
        message: 'Sport with this name already exists' 
      });
    }

    const sport = new Sport({
      name: name.trim(),
      category,
      description,
      rulesLink: rulesLink || null,
      popularity: popularity || 'Medium',
      createdBy: req.user.userId,
    });

    await sport.save();
    await sport.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Sport created successfully',
      sport,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error creating sport', 
      error: error.message 
    });
  }
};

exports.updateSport = async (req, res) => {
  try {
    const { name, category, description, rulesLink, popularity, isActive } = req.body;

    const sport = await Sport.findById(req.params.id);

    if (!sport) {
      return res.status(404).json({ 
        success: false,
        message: 'Sport not found' 
      });
    }

    if (name) sport.name = name.trim();
    if (category) sport.category = category;
    if (description) sport.description = description;
    if (rulesLink !== undefined) sport.rulesLink = rulesLink;
    if (popularity) sport.popularity = popularity;
    if (isActive !== undefined) sport.isActive = isActive;

    sport.updatedAt = Date.now();
    await sport.save();
    await sport.populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Sport updated successfully',
      sport,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error updating sport', 
      error: error.message 
    });
  }
};

exports.deleteSport = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);

    if (!sport) {
      return res.status(404).json({ 
        success: false,
        message: 'Sport not found' 
      });
    }

    await Sport.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Sport deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting sport', 
      error: error.message 
    });
  }
};