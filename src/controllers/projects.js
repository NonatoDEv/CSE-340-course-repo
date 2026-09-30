import { getAllProjects, getProjectDetails } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { getUpcomingProjects } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { createNewProject } from '../models/projects.js';
import { body, validationResult } from 'express-validator';
import { updateProject } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

const showProjectsPage = async (req, res) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';

        res.render('projects', { title, projects });
    } 
    catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).send('Internal Server Error');
    }
};

export { showProjectsPage };

const showProjectDetailsPage = async (req, res) => {
    console.log(project);
    try{
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).send(`<h1>Error 404</h1><p>No se encontró ningún proyecto con el ID: ${projectId}</p>`);
        }
        const categories = await getCategoriesByProjectId(projectId);
        const title = 'Project Details';

        res.render('project', { title, project, categories });
    }
    catch(error) {
        console.error('Error fetching project details:', error);
        res.status(500).send(`
            <h1>Error detectado:</h1>
            <h2 style="color: red;">${error.message}</h2>
            <pre style="background: #eee; padding: 10px;">${error.stack}</pre>
        `);
    }
}

export {showProjectDetailsPage};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Project';
    res.render('new-project', { title, organizations });
}
export { showNewProjectForm };

const processNewProjectForm = async (req, res) => {
    const {title, description, location, date, organizationId} = req.body;
    
    try{
        const newProjectId = await createNewProject(title, description, location, date, organizationId);
        req.flash('success', 'New Service project created successfully!');
        
        req.redirect(`/project/${newProjectId}`);
    }
    catch(error){
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        // Redirect back to the new project form
        return res.redirect('/new-project');
        }
    }
}
export {projectValidation}
export { processNewProjectForm };

const showEditProjectForm = async(req, res, next) => {
    try{
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);
        const organizations = await getAllOrganizations();

        if (project && project.date){
            project.formatted_date = new Date (project.date).toISOString().split('T')[0];
        }

        res.render('update-project',{
            title: 'Edit Service Project',
            project: project,
            organizations: organizations
        });
    }
    catch(error){
        next(error)
    }
};

const processEditProjectForm = async (req, res, next) => {
    try{
        const projectId = req.params.id;
        const {title, description, date, organizationId} = req.body
        await updateProject (projectId, {
            title,
            description,
            date,
            organizationId

        });

        req.flash('Success','Project updated Successfully');
        res.direct('/project/${projectId}');

    }
    catch(error){
        next(error)
    }
}

export{showEditProjectForm, processEditProjectForm}