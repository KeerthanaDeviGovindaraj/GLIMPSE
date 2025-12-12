// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: {
      values: ['Admin', 'User', 'Analyst', 'admin', 'user', 'analyst'],
      message: '{VALUE} is not a valid role'
    },
    default: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['enabled', 'disabled'],
    default: 'enabled'
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ status: 1 });

// Virtual for user's full profile
userSchema.virtual('profile').get(function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    bio: this.bio,
    isActive: this.isActive,
    status: this.status,
    lastLogin: this.lastLogin,
    loginCount: this.loginCount,
    memberSince: this.createdAt
  };
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Trim and lowercase email
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase().trim();
  }
  
  // Trim name
  if (this.isModified('name')) {
    this.name = this.name.trim();
  }

  // Sync isActive with status
  if (this.isModified('isActive')) {
    this.status = this.isActive ? 'enabled' : 'disabled';
  }
  if (this.isModified('status')) {
    this.isActive = this.status === 'enabled';
  }

  // Hash password if modified
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  
  next();
});

// Post-save logging
userSchema.post('save', function(doc) {
  console.log(`👤 User saved: ${doc.name} (${doc.email})`);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to update last login
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
  return await this.save();
};

// Instance method to get public data (without password)
userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role.toLowerCase(),
    avatar: this.avatar,
    bio: this.bio,
    isActive: this.isActive,
    status: this.status,
    createdAt: this.createdAt
  };
};

// Override toJSON to remove password and normalize role
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  
  // Normalize role to lowercase for frontend
  if (obj.role) {
    obj.role = obj.role.toLowerCase();
  }
  
  // Ensure status is set based on isActive
  obj.status = obj.isActive ? 'enabled' : 'disabled';
  
  return obj;
};

// Static method to find by role
userSchema.statics.findByRole = function(role) {
  return this.find({ role, isActive: true });
};

// Static method to count users by role
userSchema.statics.countByRole = async function() {
  return await this.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);
};

const User = mongoose.model('User', userSchema);

module.exports = User;