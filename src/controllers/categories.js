import { getAllCategories } from '../models/categories.js';
import { getCategoryById } from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';


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