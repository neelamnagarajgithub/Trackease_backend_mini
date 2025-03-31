const Task = require('../models/task.model');
const Project = require('../models/project.model');

// Get all tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('assignedTo', 'name email position')
            .populate('project', 'name status');
        
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ 
            message: 'Error fetching tasks', 
            error: error.message 
        });
    }
};

// Get single task by ID
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email position')
            .populate('project', 'name status');
        
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
        const newTask = new Task(req.body);
        const savedTask = await newTask.save();
        
        // Update project task count
        if (savedTask.project) {
            await updateProjectTaskCount(savedTask.project);
        }
        
        const populatedTask = await Task.findById(savedTask._id)
            .populate('assignedTo', 'name email position')
            .populate('project', 'name status');
        
        res.status(201).json(populatedTask);
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
        const originalTask = await Task.findById(req.params.id);
        
        if (!originalTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        const wasCompleted = originalTask.status === 'completed';
        const willBeCompleted = req.body.status === 'completed';
        const projectChanged = req.body.project && originalTask.project?.toString() !== req.body.project;
        
        // Update the task
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        .populate('assignedTo', 'name email position')
        .populate('project', 'name status');
        
        // Update project task counts if completion status changed
        if (wasCompleted !== willBeCompleted || projectChanged) {
            // Update old project count if project changed
            if (projectChanged && originalTask.project) {
                await updateProjectTaskCount(originalTask.project);
            }
            
            // Update new/current project count
            if (updatedTask.project) {
                await updateProjectTaskCount(updatedTask.project);
            }
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
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        // Update project task count
        if (deletedTask.project) {
            await updateProjectTaskCount(deletedTask.project);
        }
        
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ 
            message: 'Error deleting task', 
            error: error.message 
        });
    }
};

// Helper function to update project task counts
const updateProjectTaskCount = async (projectId) => {
    try {
        const totalTasks = await Task.countDocuments({ project: projectId });
        const completedTasks = await Task.countDocuments({ 
            project: projectId,
            status: 'completed'
        });
        
        await Project.findByIdAndUpdate(projectId, {
            totalTasks,
            completedTasks
        });
    } catch (error) {
        console.error('Error updating project task count:', error);
        throw error;
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
}; 