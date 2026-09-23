import { getAllProjects } from '../models/projects.js';
import { getUpcomingProjects } from '../models/projects.js';
import { getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

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