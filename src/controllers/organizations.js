import { getAllOrganizations, getOrganizationDetailsPage, getProjectsByOrganizationId } from '../models/organizations.js';
import {createOrganization} from '../models/organizations.js';
import { body, validationResult } from 'express-validator';
import { updateOrganization, getOrganizationById} from '../models/organizations.js'; 

// Define validation and sanitization rules for organization form
// Define validation rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
];

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

const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
}

const processNewOrganizationForm = async (req, res) => {
    console.log("=== DATA FROM FORM NEW ORGANIZATION ===");
    console.log(req.body);
    console.log("=============================================");

   // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        // Redirect back to the new organization form
        return res.redirect('/new-organization');
        }
    try{
        const { name, description, contactEmail } = req.body;
        const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations    

        const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
        req.flash('success', 'Organization added successfully!');
        res.redirect(`/organization/${organizationId}`);
        }
    catch{
        console.error("Error creando la organización en DB:", error);
        req.flash('error', 'Error creating the organization in the database.');
        return res.redirect('/new-organization');
    }
    };

const showEditOrganizationForm = async (req, res, next) => {
    try {
        const organizationId = req.params.id;
        const organizationData = await getOrganizationDetailsPage(organizationId);

        res.render('update-organization', {
            title: 'Edit Organization',
            organization: organizationData
        });
    } catch (error) {
        console.error("Error cargando el formulario de edición de organización:", error);
        next(error);
    }
};

const processEditOrganizationForm = async (req, res, next) => {
    const organizationId = req.params.id;
    
    // Validaciones del servidor requeridas por la rúbrica
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/update-organization/${organizationId}`);
    }

    try {
        const { name, description, contactEmail } = req.body;
        
        await updateOrganization(organizationId, name, description, contactEmail);
        
        req.flash('success', 'Organization updated successfully!');
        return res.redirect(`/organization/${organizationId}`);

    } catch (error) {
        console.error("Error al actualizar organización en DB:", error);
        req.flash('error', 'Database error updating the organization.');
        return res.redirect(`/update-organization/${organizationId}`);
    }
};

export { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm, organizationValidation, showEditOrganizationForm, processEditOrganizationForm };
