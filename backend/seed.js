// seed.js - Create default admin and user accounts
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sports-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');

    // Clear existing users (optional - comment out if you don't want to clear)
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Create default users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        status: 'enabled',
        isActive: true,
        bio: 'System Administrator'
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        password: 'user123',
        role: 'user',
        status: 'enabled',
        isActive: true,
        bio: 'Regular system user'
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'john123',
        role: 'user',
        status: 'enabled',
        isActive: true,
        bio: 'Sports enthusiast'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'jane123',
        role: 'user',
        status: 'enabled',
        isActive: true,
        bio: 'Team manager'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'mike123',
        role: 'user',
        status: 'disabled',
        isActive: false,
        bio: 'Inactive user'
      },
      {
        name: 'Sarah Williams',
        email: 'sarah@example.com',
        password: 'sarah123',
        role: 'admin',
        status: 'enabled',
        isActive: true,
        bio: 'Assistant Administrator'
      }
    ];

    // Insert users (passwords will be hashed by the pre-save hook)
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created user: ${user.name} (${user.email}) - Role: ${user.role}`);
    }
    
    console.log('\n════════════════════════════════════════════════════════');
    console.log('✅ Database seeded successfully!');
    console.log('════════════════════════════════════════════════════════');
    console.log('\n📧 Login Credentials:');
    console.log('──────────────────────────────────────────────────────');
    console.log('🔴 Admin: admin@example.com / admin123');
    console.log('👤 User:  user@example.com / user123');
    console.log('──────────────────────────────────────────────────────');
    console.log('\n📊 Total Users Created: ' + users.length);
    console.log('👥 Admins: 2');
    console.log('👥 Regular Users: 4');
    console.log('🔒 Disabled Users: 1 (Mike Johnson)');
    console.log('════════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed error:', error);
    process.exit(1);
  }
};

seedUsers();