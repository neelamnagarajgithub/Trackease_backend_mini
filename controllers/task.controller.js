const Task = require('../models/task.model');
const Project = require('../models/project.model');

// Get all tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ organizationId: req.organizationId })
            .populate('assignedTo', 'name email position')
            .populate('project', 'name');
        
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ 
            message: 'Error fetching tasks', 
            error: error.message 
        });
    }
};

// Get task by ID
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ 
                _id: req.params.id,
                organizationId: req.organizationId
            })
            .populate('assignedTo', 'name email position')
            .populate('project', 'name');
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.status(200).json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ 
            message: 'Error fetching task', 
            error: error.message 
        });
    }
};

// Create new task
const createTask = async (req, res) => {
    try {
        // Verify the project belongs to user's organization
        const project = await Project.findOne({
            _id: req.body.project,
            organizationId: req.organizationId
        });
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        const taskData = {
            ...req.body,
            organizationId: req.organizationId
        };
        
        const task = new Task(taskData);
        const savedTask = await task.save();
        
        // Update project task counts
        await Project.findByIdAndUpdate(project._id, {
            $inc: { totalTasks: 1 }
        });
        
        res.status(201).json(savedTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(400).json({ 
            message: 'Error creating task', 
            error: error.message 
        });
    }
};

// Update task
const updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            organizationId: req.organizationId
        });
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        // Check if status is being updated to 'completed'
        const wasCompleted = task.status === 'completed';
        const willBeCompleted = req.body.status === 'completed';
        
        // Apply updates
        Object.keys(req.body).forEach(key => {
            task[key] = req.body[key];
        });
        
        const updatedTask = await task.save();
        
        // Update project completion stats if status changed to/from completed
        if (!wasCompleted && willBeCompleted) {
            await Project.findByIdAndUpdate(task.project, {
                $inc: { completedTasks: 1 }
            });
        } else if (wasCompleted && !willBeCompleted) {
            await Project.findByIdAndUpdate(task.project, {
                $inc: { completedTasks: -1 }
            });
        }
        
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(400).json({ 
            message: 'Error updating task', 
            error: error.message 
        });
    }
};

// Delete task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            organizationId: req.organizationId
        });
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        // Update project task counts
        await Project.findByIdAndUpdate(task.project, {
            $inc: { 
                totalTasks: -1,
                completedTasks: task.status === 'completed' ? -1 : 0
            }
        });
        
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ 
            message: 'Error deleting task', 
            error: error.message 
        });
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
}; 