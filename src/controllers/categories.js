import { getAllCategories } from '../models/categories.js';
import { getCategoryById } from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';
import { getProjectDetails } from '../models/projects.js';
import {updateCategoryAssignments} from '../models/categories.js'
import{ getCategoriesByProjectId} from '../models/categories.js'
import { insertCategory } from '../models/categories.js';
import { updateCategory } from '../models/categories.js';


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

const showNewCategoryForm = (req, res) => {
    res.render('new-category', { 
        title: 'Create New Category', 
        categoryName: '', 
        error: null 
    });
};

const processNewCategoryForm = async (req, res, next) => {
    try {
        const categoryName = req.body.name || '';

        if (!categoryName || categoryName.length < 3 || categoryName.length > 100) {
            return res.render('new-category', {
                title: 'Create New Category',
                categoryName: categoryName,
                error: 'Category name must be between 3 and 100 characters long.'
            });
        }

        await insertCategory(categoryName);
        req.flash('success', 'Category created successfully.');
        res.redirect('/categories/${categoryId}');
    } catch (error) {
        next(error);
    }
};

export{ showNewCategoryForm, processNewCategoryForm}

const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        res.render('edit-category', { 
            title: 'Edit Category', 
            category: category, 
            error: null 
        });
    } catch (error) {
        next(error);
    }
};

const processEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const categoryName = req.body.name || '';

        if (!categoryName || categoryName.length < 3 || categoryName.length > 100) {
            return res.render('edit-category', {
                title: 'Edit Category',
                category: { category_id: categoryId, name: categoryName },
                error: 'Category name must be between 3 and 100 characters long.'
            });
        }

        await updateCategory(categoryId, categoryName);
        req.flash('success', 'Category updated successfully.');
        res.redirect('/categories/${categoryId}');
    } catch (error) {
        next(error);
    }
};

export{showEditCategoryForm, processEditCategoryForm}