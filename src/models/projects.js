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