import express from 'express';
import Attendance from '../models/Attendance.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Clock In
router.post('/clock-in', protect, async (req: any, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const existingAttendance = await Attendance.findOne({
            employeeId: req.user.employeeId,
            date: today,
        });

        if (existingAttendance) {
            res.status(400).json({ message: 'Already clocked in today' });
            return;
        }

        const now = new Date();
        const clockInTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Simple logic for status: Late if after 9:15 AM
        const status = (now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15)) ? 'Late' : 'On Time';

        const attendance = new Attendance({
            employeeId: req.user.employeeId,
            date: today,
            clockIn: clockInTime,
            status: status,
        });

        const createdAttendance = await attendance.save();
        res.status(201).json(createdAttendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Clock Out
router.post('/clock-out', protect, async (req: any, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const attendance = await Attendance.findOne({
            employeeId: req.user.employeeId,
            date: today,
        });

        if (!attendance) {
            res.status(400).json({ message: 'You have not clocked in today' });
            return;
        }

        if (attendance.clockOut) {
            res.status(400).json({ message: 'Already clocked out today' });
            return;
        }

        const now = new Date();
        const clockOutTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        attendance.clockOut = clockOutTime;

        const updatedAttendance = await attendance.save();
        res.json(updatedAttendance);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Stats (Admin only)
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Dynamic import to avoid circular dependency if any, or just standard import
        const Employee = (await import('../models/Employee.js')).default;

        const totalEmployees = await Employee.countDocuments();
        const attendanceToday = await Attendance.find({ date: today });

        const presentToday = attendanceToday.length;
        const late = attendanceToday.filter((a: any) => a.status === 'Late').length;
        const onLeave = totalEmployees - presentToday;

        res.json({
            totalEmployees,
            presentToday,
            late,
            onLeave
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Reports (Admin only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const reports = await Attendance.find({}).populate('employeeId', 'name email');
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Attendance (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const { status, clockIn, clockOut } = req.body;
        const attendance = await Attendance.findById(req.params.id);

        if (attendance) {
            attendance.status = status || attendance.status;
            attendance.clockIn = clockIn || attendance.clockIn;
            attendance.clockOut = clockOut || attendance.clockOut;

            const updatedAttendance = await attendance.save();
            res.json(updatedAttendance);
        } else {
            res.status(404).json({ message: 'Attendance record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
