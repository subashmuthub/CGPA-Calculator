import express, { Request, Response } from 'express';
import { User } from '../models/User';
import { CGPARecord } from '../models/CGPARecord';

const router = express.Router();

// Get all users (for development/debugging only)
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-password');
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Get all CGPA records (for development/debugging only)
router.get('/cgpa-records', async (req: Request, res: Response) => {
  try {
    const records = await CGPARecord.find({}).populate('userId', 'firstName lastName email');
    
    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Error fetching CGPA records:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch CGPA records'
    });
  }
});

// Get database statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const userCount = await User.countDocuments();
    const recordCount = await CGPARecord.countDocuments();
    
    res.json({
      success: true,
      data: {
        users: {
          total: userCount
        },
        cgpaRecords: recordCount,
        database: 'cgpa-calculator'
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch database statistics'
    });
  }
});

export default router;