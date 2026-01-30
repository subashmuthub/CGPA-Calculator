"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const CGPARecord_1 = require("../models/CGPARecord");
const router = express_1.default.Router();
// Get all users (for development/debugging only)
router.get('/users', async (req, res) => {
    try {
        const users = await User_1.User.find({}).select('-password');
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
});
// Get all CGPA records (for development/debugging only)
router.get('/cgpa-records', async (req, res) => {
    try {
        const records = await CGPARecord_1.CGPARecord.find({}).populate('userId', 'firstName lastName email');
        res.json({
            success: true,
            count: records.length,
            data: records
        });
    }
    catch (error) {
        console.error('Error fetching CGPA records:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch CGPA records'
        });
    }
});
// Get database statistics
router.get('/stats', async (req, res) => {
    try {
        const userCount = await User_1.User.countDocuments();
        const recordCount = await CGPARecord_1.CGPARecord.countDocuments();
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
    }
    catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch database statistics'
        });
    }
});
exports.default = router;
//# sourceMappingURL=debug.js.map