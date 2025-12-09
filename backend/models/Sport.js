// models/Sport.js
const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sport name is required'],
    trim: true,
    unique: true,
    minlength: [2, 'Sport name must be at least 2 characters'],
    maxlength: [100, 'Sport name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Team Sport', 'Individual Sport', 'Water Sport', 'Combat Sport', 'Other'],
      message: '{VALUE} is not a valid category'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  rulesLink: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Allow empty string or valid URL
        if (!v || v === '') return true;
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return urlPattern.test(v);
      },
      message: 'Please provide a valid URL for rules link'
    },
    default: ''
  },
  popularity: {
    type: String,
    enum: {
      values: ['High', 'Medium', 'Low'],
      message: '{VALUE} is not a valid popularity level'
    },
    default: 'Medium'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    default: 'Admin'
  },
  // Additional fields for advanced features
  imageUrl: {
    type: String,
    trim: true,
    default: ''
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  tags: {
    type: [String],
    default: []
  }
}, { 
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
sportSchema.index({ name: 1 });
sportSchema.index({ category: 1 });
sportSchema.index({ popularity: 1 });
sportSchema.index({ isActive: 1 });
sportSchema.index({ createdAt: -1 });
sportSchema.index({ name: 'text', description: 'text' }); // Text search index

// Virtual field for formatted creation date
sportSchema.virtual('createdAtFormatted').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

// Virtual field for category icon
sportSchema.virtual('categoryIcon').get(function() {
  const icons = {
    'Team Sport': '⚽',
    'Individual Sport': '🏃',
    'Water Sport': '🏊',
    'Combat Sport': '🥊',
    'Other': '🏆'
  };
  return icons[this.category] || '🏆';
});

// Instance method to increment view count
sportSchema.methods.incrementViews = async function() {
  this.viewCount += 1;
  return await this.save();
};

// Instance method to get formatted data
sportSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    category: this.category,
    categoryIcon: this.categoryIcon,
    description: this.description,
    rulesLink: this.rulesLink,
    popularity: this.popularity,
    isActive: this.isActive,
    createdBy: this.createdBy,
    rating: this.rating,
    viewCount: this.viewCount,
    tags: this.tags,
    imageUrl: this.imageUrl,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    createdAtFormatted: this.createdAtFormatted
  };
};

// Static method to find active sports
sportSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ createdAt: -1 });
};

// Static method to find by category
sportSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ name: 1 });
};

// Static method to find popular sports
sportSchema.statics.findPopular = function() {
  return this.find({ popularity: 'High', isActive: true }).sort({ viewCount: -1 });
};

// Static method to search sports
sportSchema.statics.searchSports = function(query) {
  return this.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  }).sort({ viewCount: -1 });
};

// Pre-save middleware
sportSchema.pre('save', function(next) {
  // Convert name to title case
  if (this.isModified('name')) {
    this.name = this.name.trim();
  }
  
  // Convert tags to lowercase
  if (this.isModified('tags')) {
    this.tags = this.tags.map(tag => tag.toLowerCase().trim());
  }
  
  next();
});

// Post-save middleware (logging)
sportSchema.post('save', function(doc) {
  console.log(`📊 Sport saved: ${doc.name} (${doc.category})`);
});

// Pre-remove middleware
sportSchema.pre('remove', function(next) {
  console.log(`🗑️  Removing sport: ${this.name}`);
  next();
});

const Sport = mongoose.model('Sport', sportSchema);

module.exports = Sport;