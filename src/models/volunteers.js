import db from './db.js'

const addVolunteer = async (userId, projectId) =>{
    const query = `
        INSERT INTO volunteer (user_id, project_id) 
        VALUES ($1, $2) 
        ON CONFLICT (user_id, project_id) DO NOTHING
    `;
    const result = await db.query(query, [userId, projectId]);
    return result;
}

const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM volunteer 
        WHERE user_id = $1 AND project_id = $2
    `;

    const result = await db.query(query, [userId, projectId]);
    return result;
}
const getProjectsByUserId = async (userId) => {
    const query = `
        SELECT p.*, v.created_at AS signed_up_at
        FROM service_projects p 
        JOIN volunteer v ON v.project_id = p.project_id 
        WHERE v.user_id = $1 
        ORDER BY p.project_date
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
}

export { addVolunteer, removeVolunteer, getProjectsByUserId };