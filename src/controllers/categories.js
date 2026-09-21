import { getAllCategories } from '../models/categories.js';

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