import { getAllOrganizations, getOrganizationDetailsPage, getProjectsByOrganizationId } from '../models/organizations.js';

const showOrganizationsPage = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';

        res.render('organizations', { title, organizations });
    } 
    catch (error) {
        console.error('Error fetching organizations:', error);
        res.status(500).send('Internal Server Error');
    }
};

const showOrganizationDetailsPage = async (req, res) => {
    try {
        const organizationId = req.params.id;
        const organizationDetails = await getOrganizationDetailsPage(organizationId);
        const projects = await getProjectsByOrganizationId(organizationId);
        const title = 'Organization Details';

        res.render('organization', { title, organizationDetails, projects });
    }
    catch (error) {
        console.error('Error fetching organization details:', error);
        res.status(500).send('Internal Server Error');
    }
};

export { showOrganizationsPage, showOrganizationDetailsPage };

