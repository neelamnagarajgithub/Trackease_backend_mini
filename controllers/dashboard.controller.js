const Employee = require('../models/employee.model');
const Project = require('../models/project.model');
const Task = require('../models/task.model');

const getDashboardData = async (req, res) => {
    try {
        const totalEmployees = await Employee.countDocuments();
        const activeProjects = await Project.countDocuments({ status: 'active' });
        const pendingTasks = await Task.countDocuments({ status: 'pending' });
        const attendanceRate = 85; // Mock data for demonstration purposes

        // Fetch recent activities (example: last 5 tasks)
        const recentActivities = await Task.find()
            .sort({ dueDate: -1 })
            .limit(5)
            .populate('assignedTo', 'name')
            .select('title assignedTo dueDate status');

        const formattedActivities = recentActivities.map(activity => ({
            id: activity._id,
            employee: activity.assignedTo.name,
            activity: activity.title,
            date: activity.dueDate.toISOString().split('T')[0]
        }));

        res.status(200).json({
            totalEmployees,
            activeProjects,
            pendingTasks,
            attendanceRate,
            recentActivities: formattedActivities
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
};

module.exports = { getDashboardData };