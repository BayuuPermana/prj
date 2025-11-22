import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    clockIn: { type: String },
    clockOut: { type: String },
    status: { type: String, enum: ['On Time', 'Late', 'Absent', 'Permit', 'Sick Leave'], default: 'Absent' },
    totalHours: { type: String },
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);
