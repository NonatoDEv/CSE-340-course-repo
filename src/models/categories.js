import db from './db.js'

const getAllCategories = async() => {
    try{
        const query = `
        SELECT category_id, name 
        FROM categories 
        ORDER BY name ASC;
    `;

    const result = await db.query(query);
    return result.rows;
    }
    catch (error) {
        console.error("getAllCategories error: " + error);
        throw error; 
    }
}

export { getAllCategories };

const getCategoryById = async(categoryId) => {
    try{
       const query = `
    SELECT category_id, name
    FROM categories
    WHERE category_id = $1
  `;
  const result = await db.query(query, [categoryId]);
  return result.rows[0]; 
    }
    catch (error) {
    console.error("getCategoryById error: " + error);
    throw error; 
  }
}

export { getCategoryById };

const getCategoriesByProjectId = async(projectId) => {
    try{
        const query = `
    SELECT c.category_id, c.name
    FROM categories c
    JOIN project_categories pc ON c.category_id = pc.category_id
    WHERE pc.project_id = $1
    ORDER BY c.name ASC
  `;
  const result = await db.query(query, [projectId]);
  return result.rows;
    }
    catch (error) {
    console.error("getCategoriesByProjectId error: " + error);
    throw error; 
  }
}

export { getCategoriesByProjectId };