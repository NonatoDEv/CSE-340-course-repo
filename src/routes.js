import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { showOrganizationDetailsPage,  } from './controllers/organizations.js';

import { showProjectsPage } from './controllers/projects.js';
import { showProjectDetailsPage } from './controllers/projects.js';
import { showCategoriesPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';
import { showCategoryDetailsPage } from './controllers/categories.js';
import { showNewOrganizationForm } from './controllers/organizations.js';
import { processNewOrganizationForm } from './controllers/organizations.js';
import { organizationValidation } from './controllers/organizations.js';

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
router.get('/new-organization', showNewOrganizationForm);
// Route to handle new organization form submission
router.post('/new-organization',organizationValidation ,processNewOrganizationForm)



// error-handling routes
router.get('/test-error', testErrorPage);

export default router;