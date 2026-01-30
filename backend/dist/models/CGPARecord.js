"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CGPARecord = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CourseSchema = new mongoose_1.Schema({
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
const CGPARecordSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
            validator: function (courses) {
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
exports.CGPARecord = mongoose_1.default.model('CGPARecord', CGPARecordSchema);
//# sourceMappingURL=CGPARecord.js.map