import db from './db.js'

const addVolunteer = async (userId, projectId) =>{
    const query = `
        INSERT INTO volunteer_signup (user_id, project_id) 
        VALUES ($1, $2) 
        ON CONFLICT (user_id, project_id) DO NOTHING
    `;
    const result = await db.query(query, [userId, projectId]);
    return result;
}

const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM volunteer_signup
        WHERE user_id = $1 AND project_id = $2
    `;

    const result = await db.query(query, [userId, projectId]);
    return result;
}

const getProjectsByUserId = async (userId) => {
    const query = `
        SELECT p.*, v.created_at AS signed_up_at
        FROM service_projects p 
        JOIN volunteer_signup v ON v.project_id = p.project_id 
        WHERE v.user_id = $1 
        ORDER BY p.project_date
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
}

const isVolunteer = async (userId, projectId) => {
    const query = `
        SELECT 1 
        FROM volunteer_signup 
        WHERE user_id = $1 AND project_id = $2
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
}

export {addVolunteer, removeVolunteer, getProjectsByUserId, isVolunteer};