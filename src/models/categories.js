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

const assignCategoryToProject = async(categoryId, project_id) =>{
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, project_id]);
}

const updateCategoryAssignments = async(project_id, categoryId) =>{
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

export{ updateCategoryAssignments}