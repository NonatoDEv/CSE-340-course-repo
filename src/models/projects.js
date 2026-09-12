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
        ORDER BY o.organization_id, p.project_date;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjects}