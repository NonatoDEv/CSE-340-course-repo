import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT 
            p.project_id,
            p.title AS project_title,
            p.proj_location,
            p.project_date,
            o.name
        FROM service_projects p
        JOIN organization o ON p.organization_id = o.organization_id
        ORDER BY p.project_date ASC, o.organization_id;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjects}

const getUpcomingProjects = async (number_of_projects) => {
  try {
    const query = `
      SELECT 
        p.project_id,
        p.title,
        p.description,
        p.project_date AS date,
        p.proj_location AS location,
        p.organization_id,
        o.name AS organization_name
      FROM service_projects p
      JOIN organization o ON p.organization_id = o.organization_id
      WHERE p.project_date >= CURRENT_DATE
      ORDER BY p.project_date ASC
      LIMIT $1
    `;
    
    const result = await db.query(query , [number_of_projects]);
    return result.rows;

  } catch (error) {
    console.error("getUpcomingProjects error: " + error);
    throw error; 
  }
}

export {getUpcomingProjects};

const getProjectDetails = async (project_id) => {
    try {
        const query = `
            SELECT 
                p.project_id,
                p.title AS project_title,
                p.description,
                p.project_date AS date,
                p.proj_location AS location,
                p.organization_id,
                o.name AS organization_name
            FROM service_projects p
            JOIN organization o ON p.organization_id = o.organization_id
            WHERE p.project_id = $1
        `;

        const result = await db.query(query, [project_id]);
        return result.rows[0];
    } catch (error) {
        console.error("getProjectDetails error: " + error);
        throw error;
    }
};

export {getProjectDetails};

const getProjectsByCategoryId = async(categoryId) => {
    try{
        const sql = `
            SELECT 
            p.project_id, 
            p.title AS project_title, 
            p.description, 
            p.proj_location AS location, 
            p.project_date AS date,
            o.organization_id,
            o.name AS organization_name
        FROM service_projects p
        JOIN project_categories pc ON p.project_id = pc.project_id
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date ASC
        `;
        const result = await db.query(sql, [categoryId]);
        return result.rows;
    }
    catch (error) {
    console.error("getProjectsByCategoryId error: " + error);
    throw error;
  }
}

export { getProjectsByCategoryId };