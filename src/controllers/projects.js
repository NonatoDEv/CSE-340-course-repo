import { getAllProjects } from '../models/projects.js';
import { getUpcomingProjects } from '../models/projects.js';
import { getProjectDetails } from '../models/projects.js';

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
        const title = 'Project Details';

        res.render('project', { title, project });
    }
    catch(error) {
        console.error('Error fetching project details:', error);
        res.status(500).send('Internal Server Error');
    }
}

export {showProjectDetailsPage};