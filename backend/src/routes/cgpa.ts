import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { CGPARecord, ICourse } from '../models/CGPARecord';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Grade point mapping
const gradePointMap: { [key: string]: number } = {
  'O': 10.0,
  'A+': 9.0,
  'A': 8.0,
  'B+': 7.0,
  'B': 6.0,
  'C': 5.0,
  'U': 0.0
};

// Helper function to calculate GPA
const calculateGPA = (courses: ICourse[]): number => {
  const totalPoints = courses.reduce((sum, course) => {
    return sum + (course.gradePoint * course.credits);
  }, 0);
  
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  
  return totalCredits > 0 ? totalPoints / totalCredits : 0;
};

// Helper function to calculate CGPA
const calculateCGPA = async (userId: string, currentSemesterGPA: number, currentCredits: number): Promise<number> => {
  const previousRecords = await CGPARecord.find({ userId });
  
  let totalPoints = currentSemesterGPA * currentCredits;
  let totalCredits = currentCredits;
  
  previousRecords.forEach(record => {
    totalPoints += record.semesterGPA * record.totalCredits;
    totalCredits += record.totalCredits;
  });
  
  return totalCredits > 0 ? totalPoints / totalCredits : 0;
};

// Create/Update CGPA record
router.post('/record', [
  authMiddleware,
  body('semester')
    .isIn(['ODD', 'EVEN'])
    .withMessage('Semester must be ODD or EVEN'),
  body('year')
    .matches(/^\d{4}$/)
    .withMessage('Year must be a valid 4-digit year'),
  body('courses')
    .isArray({ min: 1 })
    .withMessage('At least one course is required'),
  body('courses.*.courseName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Course name is required and must not exceed 100 characters'),
  body('courses.*.courseCode')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Course code is required and must not exceed 20 characters'),
  body('courses.*.credits')
    .isFloat({ min: 0.5, max: 10 })
    .withMessage('Credits must be between 0.5 and 10'),
  body('courses.*.grade')
    .isIn(['O', 'A+', 'A', 'B+', 'B', 'C', 'U'])
    .withMessage('Grade must be a valid letter grade')
], async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = (req as any).user.userId;
    const { semester, year, courses } = req.body;

    // Process courses and calculate grade points
    const processedCourses: ICourse[] = courses.map((course: any) => ({
      ...course,
      courseCode: course.courseCode.toUpperCase(),
      grade: course.grade.toUpperCase(),
      gradePoint: gradePointMap[course.grade.toUpperCase()]
    }));

    // Calculate semester GPA
    const semesterGPA = calculateGPA(processedCourses);
    const totalCredits = processedCourses.reduce((sum, course) => sum + course.credits, 0);

    // Calculate cumulative CGPA
    const cumulativeCGPA = await calculateCGPA(userId, semesterGPA, totalCredits);

    // Check if record already exists for this semester/year
    const existingRecord = await CGPARecord.findOne({ userId, semester, year });

    if (existingRecord) {
      // Update existing record
      existingRecord.courses = processedCourses;
      existingRecord.semesterGPA = semesterGPA;
      existingRecord.cumulativeCGPA = cumulativeCGPA;
      existingRecord.totalCredits = totalCredits;
      
      await existingRecord.save();

      res.json({
        success: true,
        message: 'CGPA record updated successfully',
        data: {
          record: existingRecord
        }
      });
    } else {
      // Create new record
      const cgpaRecord = new CGPARecord({
        userId,
        semester,
        year,
        courses: processedCourses,
        semesterGPA,
        cumulativeCGPA,
        totalCredits
      });

      await cgpaRecord.save();

      res.status(201).json({
        success: true,
        message: 'CGPA record created successfully',
        data: {
          record: cgpaRecord
        }
      });
    }

    // Recalculate CGPA for all records after this update
    await recalculateAllCGPA(userId);

  } catch (error) {
    console.error('CGPA record creation/update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while processing CGPA record'
    });
  }
});

// Helper function to recalculate CGPA for all records
const recalculateAllCGPA = async (userId: string) => {
  const records = await CGPARecord.find({ userId }).sort({ year: 1, semester: 1 });
  
  let cumulativePoints = 0;
  let cumulativeCredits = 0;

  for (const record of records) {
    cumulativePoints += record.semesterGPA * record.totalCredits;
    cumulativeCredits += record.totalCredits;
    
    const cgpa = cumulativeCredits > 0 ? cumulativePoints / cumulativeCredits : 0;
    record.cumulativeCGPA = cgpa;
    
    await record.save();
  }
};

// Get all CGPA records for a user
router.get('/records', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    
    const records = await CGPARecord.find({ userId }).sort({ year: -1, semester: -1 });

    const summary = {
      totalRecords: records.length,
      currentCGPA: records.length > 0 ? records[0].cumulativeCGPA : 0,
      totalCredits: records.reduce((sum, record) => sum + record.totalCredits, 0)
    };

    res.json({
      success: true,
      data: {
        records,
        summary
      }
    });

  } catch (error) {
    console.error('Get CGPA records error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching CGPA records'
    });
  }
});

// Get specific CGPA record
router.get('/record/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const recordId = req.params.id;

    const record = await CGPARecord.findOne({ _id: recordId, userId });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'CGPA record not found'
      });
    }

    res.json({
      success: true,
      data: {
        record
      }
    });

  } catch (error) {
    console.error('Get CGPA record error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching CGPA record'
    });
  }
});

// Delete CGPA record
router.delete('/record/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const recordId = req.params.id;

    const record = await CGPARecord.findOneAndDelete({ _id: recordId, userId });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'CGPA record not found'
      });
    }

    // Recalculate CGPA for remaining records
    await recalculateAllCGPA(userId);

    res.json({
      success: true,
      message: 'CGPA record deleted successfully'
    });

  } catch (error) {
    console.error('Delete CGPA record error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting CGPA record'
    });
  }
});

// Get grade point mapping
router.get('/grade-points', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      gradePointMap,
      availableGrades: Object.keys(gradePointMap)
    }
  });
});

export default router;