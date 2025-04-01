const Project = require('../models/project.model');
const Employee = require('../models/employee.model');
const Task = require('../models/task.model');

// Get all projects
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({ organizationId: req.organizationId })
            .populate('assignedEmployees', 'name email position');
        
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ 
            message: 'Error fetching projects', 
            error: error.message 
        });
    }
};

// Get single project by ID
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({
                _id: req.params.id,
                organizationId: req.organizationId
            })
            .populate('assignedEmployees', 'name email position');
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        res.status(200).json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ 
            message: 'Error fetching project', 
            error: error.message 
        });
    }
};

// Create new project
const createProject = async (req, res) => {
    try {
        const projectData = {
            ...req.body,
            organizationId: req.organizationId
        };
        
        const newProject = new Project(projectData);
        const savedProject = await newProject.save();
        
        res.status(201).json(savedProject);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(400).json({ 
            message: 'Error creating project', 
            error: error.message 
        });
    }
};

// Update project
const updateProject = async (req, res) => {
    try {
        const updatedProject = await Project.findOneAndUpdate(
            {
                _id: req.params.id,
                organizationId: req.organizationId
            },
            req.body,
            { new: true, runValidators: true }
        ).populate('assignedEmployees', 'name email position');
        
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(400).json({ 
            message: 'Error updating project', 
            error: error.message 
        });
    }
};

// Delete project
const deleteProject = async (req, res) => {
    try {
        const deletedProject = await Project.findOneAndDelete({
            _id: req.params.id,
            organizationId: req.organizationId
        });
        
        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        // Also delete associated tasks
        await Task.deleteMany({ 
            project: req.params.id,
            organizationId: req.organizationId 
        });
        
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ 
            message: 'Error deleting project', 
            error: error.message 
        });
    }
};

// Get project tasks
const getProjectTasks = async (req, res) => {
    try {
        // First verify that the project belongs to the user's organization
        const project = await Project.findOne({
            _id: req.params.id,
            organizationId: req.organizationId
        });
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        const tasks = await Task.find({ 
                project: req.params.id,
                organizationId: req.organizationId
            })
            .populate('assignedTo', 'name email position')
            .populate('project', 'name');
        
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching project tasks:', error);
        res.status(500).json({ 
            message: 'Error fetching project tasks', 
            error: error.message 
        });
    }
};

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectTasks
}; 