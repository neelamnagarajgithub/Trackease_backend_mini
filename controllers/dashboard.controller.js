const Employee = require('../models/employee.model');
const Project = require('../models/project.model');
const Task = require('../models/task.model');

const getDashboardData = async (req, res) => {
    try {
        // Basic metrics
        const totalEmployees = await Employee.countDocuments();
        const activeProjects = await Project.countDocuments({ status: 'active' });
        const pendingTasks = await Task.countDocuments({ status: 'pending' });
        const completedTasks = await Task.countDocuments({ status: 'completed' });
        const attendanceRate = 85; // Mock data for demonstration purposes

        // Project progress metrics - Calculate overall project completion percentage
        const projects = await Project.find({ status: 'active' })
            .select('name startDate endDate totalTasks completedTasks')
            .limit(5);

        const projectProgress = projects.map(project => {
            const progressPercentage = project.totalTasks > 0 
                ? Math.round((project.completedTasks / project.totalTasks) * 100) 
                : 0;
            
            return {
                id: project._id,
                name: project.name,
                progress: progressPercentage,
                startDate: project.startDate.toISOString().split('T')[0],
                endDate: project.endDate.toISOString().split('T')[0]
            };
        });

        // Task status distribution
        const taskStatusDistribution = {
            pending: pendingTasks,
            inProgress: await Task.countDocuments({ status: 'in-progress' }),
            completed: completedTasks,
            overdue: await Task.countDocuments({ 
                status: { $ne: 'completed' }, 
                dueDate: { $lt: new Date() } 
            })
        };

        // Fetch recent activities (example: last 5 tasks)
        const recentActivities = await Task.find()
            .sort({ updatedAt: -1 })
            .limit(5)
            .populate('assignedTo', 'name')
            .select('title assignedTo dueDate status updatedAt');

        const formattedActivities = recentActivities.map(activity => ({
            id: activity._id,
            employee: activity.assignedTo ? activity.assignedTo.name : 'Unassigned',
            activity: `${activity.title} - ${activity.status}`,
            date: activity.updatedAt.toISOString().split('T')[0]
        }));

        // Calculate task completion rate
        const totalTasks = pendingTasks + completedTasks + taskStatusDistribution.inProgress;
        const taskCompletionRate = totalTasks > 0 
            ? Math.round((completedTasks / totalTasks) * 100) 
            : 0;

        res.status(200).json({
            totalEmployees,
            activeProjects,
            pendingTasks,
            attendanceRate,
            recentActivities: formattedActivities,
            projectProgress,
            taskStatusDistribution,
            taskCompletionRate
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ 
            message: 'Error fetching dashboard data',
            error: error.message 
        });
    }
};

module.exports = { getDashboardData };