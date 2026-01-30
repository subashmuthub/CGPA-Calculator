// Simple script to view database data
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cgpa_calculator');

// Define schemas (simplified)
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String
}, { timestamps: true });

const CGPARecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  semester: String,
  year: String,
  courses: [{
    courseName: String,
    courseCode: String,
    credits: Number,
    grade: String,
    gradePoint: Number
  }],
  semesterGPA: Number,
  cumulativeCGPA: Number,
  totalCredits: Number
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const CGPARecord = mongoose.model('CGPARecord', CGPARecordSchema);

async function viewData() {
  try {
    console.log('📊 CGPA Calculator Database Data\n');
    console.log('='.repeat(50));
    
    // Get all users
    const users = await User.find({}, 'firstName lastName email createdAt');
    console.log(`\n👥 USERS (${users.length} found):`);
    console.log('-'.repeat(30));
    users.forEach(user => {
      console.log(`• ${user.firstName} ${user.lastName}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Registered: ${user.createdAt.toLocaleDateString()}`);
      console.log();
    });

    // Get all CGPA records
    const records = await CGPARecord.find({}).populate('userId', 'firstName lastName email');
    console.log(`\n📈 CGPA RECORDS (${records.length} found):`);
    console.log('-'.repeat(40));
    
    for (const record of records) {
      if (record.userId) {
        console.log(`\n🎓 ${record.userId.firstName} ${record.userId.lastName} (${record.userId.email})`);
        console.log(`   Semester: ${record.semester} ${record.year}`);
        console.log(`   GPA: ${record.semesterGPA}/10.0`);
        console.log(`   CGPA: ${record.cumulativeCGPA}/10.0`);
        console.log(`   Total Credits: ${record.totalCredits}`);
        console.log(`   Courses:`);
        record.courses.forEach(course => {
          console.log(`     • ${course.courseName} (${course.courseCode})`);
          console.log(`       Grade: ${course.grade} = ${course.gradePoint} points`);
          console.log(`       Credits: ${course.credits}`);
        });
      }
    }
    
    console.log('\n' + '='.repeat(50));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed.');
  }
}

viewData();