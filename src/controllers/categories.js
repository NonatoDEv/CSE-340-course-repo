import { getAllCategories } from '../models/categories.js';
import { getCategoryById } from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';
import { getProjectDetails } from '../models/projects.js';
import {updateCategoryAssignments} from '../models/categories.js'
import{ getCategoriesByProjectId} from '../models/categories.js'


const showCategoriesPage = async (req, res) => {
    try {
      const categories = await getAllCategories();
      const title = 'Categories';
      res.render('categories', { title, categories });
    } 
    catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send('Internal Server Error');
  }
};

export { showCategoriesPage };

const showCategoryDetailsPage = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);
        const projects = await getProjectsByCategoryId(categoryId);
        const title = category ? `${category.name} Projects` : 'Category Details';

        res.render('category', { title, category, projects });
    }
    catch(error) {
        console.error('Error fetching category details:', error);
        res.status(500).send('Internal Server Error');
    }
}

export { showCategoryDetailsPage }; 

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

export{ showAssignCategoriesForm, processAssignCategoriesForm}