import { addVolunteer, removeVolunteer} from '../models/volunteers.js';


const addVolunteerForProject = async (req, res) => {
    const userId = req.session.user.user_id;
    const projectId = req.params.projectId;
    try{
        const showAddVolunteer = await addVolunteer(userId, projectId);
        if (showAddVolunteer.rowCount > 0) {
            req.flash('success', 'You have successfully signed up to volunteer for this project.');
        }
        else {
            req.flash('info', 'You are already signed up to volunteer for this project.');
        }
    }
    catch(error){
        console.error('Error occurred while signing up to volunteer for project:', error);
        req.flash('error', 'An error occurred while signing up to volunteer for this project.');
    }
    res.redirect(`/project/${projectId}`);
}

const removeVolunteerFromProject = async (req, res) => {
    const userId = req.session.user.user_id;
    const projectId = req.params.projectId;
    try{
        const showRemoveVolunteer = await removeVolunteer(userId, projectId);
        if (showRemoveVolunteer.rowCount > 0) {
            req.flash('success', 'You have successfully removed yourself from volunteering for this project.');
        }
        else {
            req.flash('info', 'You were not signed up to volunteer for this project.');
        }
    }
    catch(error){
        console.error('Error occurred while removing volunteer from project:', error);
        req.flash('error', 'An error occurred while removing yourself from volunteering for this project.');
    }
    res.redirect(`/project/${projectId}`);
}

export{ addVolunteerForProject, removeVolunteerFromProject}