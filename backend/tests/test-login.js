// Quick test for login functionality
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cgpa_calculator');

// User schema (minimal for testing)
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String
}, { timestamps: true });

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

async function testLogin() {
  try {
    console.log('🧪 Testing Login Functionality\n');
    
    // Test with existing users from database
    const existingUsers = await User.find({}, 'firstName lastName email');
    console.log('📋 Available users in database:');
    existingUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} - ${user.email}`);
    });
    
    console.log('\n🔐 Testing login for existing users...\n');
    
    // Try logging in with test@example.com (password should be "password123")
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (testUser) {
      console.log('Found test@example.com user ✅');
      
      // Test password
      const testPasswords = ['password123', 'Password123', 'PASSWORD123', 'Test123'];
      
      for (const testPassword of testPasswords) {
        try {
          const isValid = await testUser.comparePassword(testPassword);
          console.log(`Password "${testPassword}": ${isValid ? '✅ VALID' : '❌ Invalid'}`);
          
          if (isValid) {
            // Generate JWT token
            const token = jwt.sign(
              { userId: testUser._id, email: testUser.email },
              process.env.JWT_SECRET || 'fallback_secret_key',
              { expiresIn: '24h' }
            );
            console.log(`🎯 LOGIN SUCCESS! Token: ${token.substring(0, 20)}...`);
            break;
          }
        } catch (error) {
          console.log(`Password "${testPassword}": ❌ Error - ${error.message}`);
        }
      }
    } else {
      console.log('❌ test@example.com user not found');
    }
    
    // Test with other users
    for (const user of existingUsers.slice(0, 2)) {
      console.log(`\n🔑 Testing user: ${user.email}`);
      const testPasswords = ['password123', 'Password123', '123456', 'test123'];
      
      for (const testPassword of testPasswords) {
        try {
          const foundUser = await User.findById(user._id);
          const isValid = await foundUser.comparePassword(testPassword);
          if (isValid) {
            console.log(`✅ Login SUCCESS for ${user.email} with password "${testPassword}"`);
            break;
          }
        } catch (error) {
          // Silent failure for testing
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Test completed.');
  }
}

testLogin();