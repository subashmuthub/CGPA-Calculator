import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse {
  courseName: string;
  courseCode: string;
  credits: number;
  grade: string;
  gradePoint: number;
}

export interface ICGPARecord extends Document {
  userId: mongoose.Types.ObjectId;
  semester: string;
  year: string;
  courses: ICourse[];
  semesterGPA: number;
  cumulativeCGPA: number;
  totalCredits: number;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema = new Schema({
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
    maxlength: [100, 'Course name cannot exceed 100 characters']
  },
  courseCode: {
    type: String,
    required: [true, 'Course code is required'],
    trim: true,
    uppercase: true,
    maxlength: [20, 'Course code cannot exceed 20 characters']
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: [0.5, 'Credits must be at least 0.5'],
    max: [10, 'Credits cannot exceed 10']
  },
  grade: {
    type: String,
    required: [true, 'Grade is required'],
    enum: ['O', 'A+', 'A', 'B+', 'B', 'C', 'U'],
    uppercase: true
  },
  gradePoint: {
    type: Number,
    required: [true, 'Grade point is required'],
    min: [0, 'Grade point cannot be negative'],
    max: [10.0, 'Grade point cannot exceed 10.0']
  }
});

const CGPARecordSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  semester: {
    type: String,
    required: [true, 'Semester is required'],
    enum: ['ODD', 'EVEN'],
    trim: true
  },
  year: {
    type: String,
    required: [true, 'Year is required'],
    match: [/^\d{4}$/, 'Year must be a valid 4-digit year']
  },
  courses: {
    type: [CourseSchema],
    required: true,
    validate: {
      validator: function(courses: ICourse[]) {
        return courses.length > 0;
      },
      message: 'At least one course is required'
    }
  },
  semesterGPA: {
    type: Number,
    required: true,
    min: [0, 'GPA cannot be negative'],
    max: [10.0, 'GPA cannot exceed 10.0']
  },
  cumulativeCGPA: {
    type: Number,
    required: true,
    min: [0, 'CGPA cannot be negative'],
    max: [10.0, 'CGPA cannot exceed 10.0']
  },
  totalCredits: {
    type: Number,
    required: true,
    min: [0, 'Total credits cannot be negative']
  }
}, {
  timestamps: true
});

// Create indexes for better performance
CGPARecordSchema.index({ userId: 1, semester: 1, year: 1 }, { unique: true });

export const CGPARecord = mongoose.model<ICGPARecord>('CGPARecord', CGPARecordSchema);