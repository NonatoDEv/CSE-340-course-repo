import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { showOrganizationDetailsPage,  } from './controllers/organizations.js';
import { showEditOrganizationForm, processEditOrganizationForm } from './controllers/organizations.js';
import { showProjectsPage } from './controllers/projects.js';
import { showProjectDetailsPage } from './controllers/projects.js';
import { showCategoriesPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';
import { showCategoryDetailsPage } from './controllers/categories.js';
import { showNewOrganizationForm } from './controllers/organizations.js';
import { processNewOrganizationForm } from './controllers/organizations.js';
import { organizationValidation } from './controllers/organizations.js';
import { showNewProjectForm } from './controllers/projects.js';
import { processNewProjectForm } from './controllers/projects.js';
import { projectValidation } from './controllers/projects.js';
import { showAssignCategoriesForm, processAssignCategoriesForm } from './controllers/categories.js';
import { showEditProjectForm, processEditProjectForm } from './controllers/projects.js';
import { categoryValidation, showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm } from './controllers/categories.js';
import { showUserRegistrationForm, processUserRegistrationForm, showDashboard } from './controllers/users.js';
import { showLoginForm, processLoginForm, processLogout, requireRole } from './controllers/users.js';
import {requireLogin} from './models/users.js';


const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);
//Route for project details page
router.get('/project/:id', showProjectDetailsPage);
//Route for category details page
router.get('/category/:id', showCategoryDetailsPage);
// Route for new organization form
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
// Route to handle new organization form submission
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);
//Route to update organization details form submission
router.get('/update-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/update-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);
//Route for new project page
router.get('/new-project', requireRole('admin'), showNewProjectForm);
//Route to handle new project form submission
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);
// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);
// Routes to handle the update project details to project form
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);
// Routes to handle new categories created
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);
//Routes to handle the update categories
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);
//Routes to handle user registration
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
//Routes to handle user login
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
//Route to handle user logout
router.get('/logout', processLogout);
//Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);


// error-handling routes
router.get('/test-error', testErrorPage);

export default router;