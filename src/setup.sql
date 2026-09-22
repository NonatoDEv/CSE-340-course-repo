DROP TABLE IF EXISTS project_categories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS service_projects CASCADE;
DROP TABLE IF EXISTS organization CASCADE;

-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert Sample Data into Organization Table
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename) 
VALUES 
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


SELECT * FROM organization;

CREATE TABLE service_projects (
	project_id SERIAL PRIMARY KEY,
	organization_id INT NOT NULL,
	title VARCHAR(150) NOT NULL,
	description TEXT,
	proj_location VARCHAR(255) NOT NULL,
	project_date DATE NOT NULL,
	CONSTRAINT fk_organization
		FOREIGN key(organization_id)
		REFERENCES organization(organization_id)
		ON DELETE CASCADE
);
	
INSERT INTO service_projects (organization_id, title, description, proj_location, project_date)
VALUES
-- BrightFuture Builders (ID: 1: Construction & Infrastructure)
(1, 'Community Center Roof Repair', 'Fixing leaks and adding thermal insulation to keep the building warm in winter.', 'San Martin Community Center, 123 Main St', '2026-10-05'),
(1, 'Wheelchair Ramp Installation', 'Building concrete access ramps to make the public library accessible for all.', 'Central Public Library, 450 Oak Ave', '2026-10-18'),
(1, 'Solar Panel Setup', 'Installing eco-friendly solar panels on the roof of the local homeless shelter.', 'Hope Shelter, 789 Pine St', '2026-11-02'),
(1, 'Recycled Playground Build', 'Assembling safe swings and benches using recycled plastic and wood.', 'Sunset Public Park, Sector 4', '2026-11-20'),
(1, 'Rainwater Tank Installation', 'Setting up gutters and storage tanks to collect clean rainwater at a rural school.', 'Primary School #12, East Valley Road', '2026-12-01'),

-- GreenHarvest Growers (ID: 2: Urban Farming & Food)
(2, 'Rooftop Garden Workshop', 'Teaching neighbors how to build small vegetable beds in urban spaces.', 'Green Terrace, 304 Maple St', '2026-10-08'),
(2, 'Community Seed Bank Launch', 'Collecting, sorting, and sharing organic seeds with local families.', 'Central Market Plaza, Stand 15', '2026-10-25'),
(2, 'Fresh Vegetable Harvest Day', 'Picking fresh tomatoes, carrots, and lettuce for local soup kitchens.', 'GreenHarvest Farm, North Plot', '2026-11-12'),
(2, 'Compost Bin Construction', 'Building wooden compost boxes in parks to turn food waste into soil.', 'Meadow Ecological Park', '2026-11-28'),
(2, 'Hydroponics for Kids', 'Demonstrating water-based plant growing techniques to middle school students.', 'Lincoln Middle School Science Lab', '2026-12-10'),

-- UnityServe Volunteers (ID: 3: Community Charity & Coordination)
(3, 'Community Blood Drive', 'Assisting nurses and welcoming donors for the regional blood bank.', 'City General Hospital, Gate 3', '2026-10-12'),
(3, 'Food Bank Box Packing', 'Sorting non-perishable canned food and making family kits.', 'Central Relief Warehouse, Bay 2', '2026-10-29'),
(3, 'Senior Center Reading Day', 'Spending quality time playing board games and reading stories with elderly residents.', 'St. Vincent Nursing Home, Room 10', '2026-11-15'),
(3, 'Backpack and School Supply Drive', 'Gathering notebooks, pencils, and backpacks for low-income students.', 'Community Sports Center, Court 1', '2026-11-24'),
(3, 'River Cleanup Brigade', 'Collecting plastic bottles and trash along the riverbanks.', 'Riverfront Bridge, North Trail', '2026-12-05');

SELECT * FROM service_projects;

SELECT 
    p.project_id,
    p.title AS project_title,
    p.proj_location,
    p.project_date,
    o.name
FROM service_projects p
JOIN organization o ON p.organization_id = o.organization_id
ORDER BY o.organization_id, p.project_date;

-- ========================================================
-- 3. Categories Table
-- ========================================================
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO categories (name) VALUES
('Infrastructure & Construction'),
('Environment & Sustainability'),
('Food Security & Nutrition'),
('Education & Youth'),
('Health & Community Care');

SELECT * FROM categories;

-- ========================================================
-- 4. Many-to-Many Table: Project Categories
-- ========================================================
CREATE TABLE project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES service_projects(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

-- Associate every project with at least one category
INSERT INTO project_categories (project_id, category_id) VALUES
-- BrightFuture Builders (Projects 1 to 5)
(1, 1),          -- Community Center Roof Repair -> Infrastructure & Construction
(2, 1), (2, 5),   -- Wheelchair Ramp Installation -> Infrastructure & Construction + Health & Community Care
(3, 1), (3, 2),   -- Solar Panel Setup -> Infrastructure & Construction + Environment & Sustainability
(4, 1), (4, 2),   -- Recycled Playground Build -> Infrastructure & Construction + Environment & Sustainability
(5, 1), (5, 2),   -- Rainwater Tank Installation -> Infrastructure & Construction + Environment & Sustainability

-- GreenHarvest Growers (Projects 6 to 10)
(6, 2), (6, 4),   -- Rooftop Garden Workshop -> Environment & Sustainability + Education & Youth
(7, 2), (7, 3),   -- Community Seed Bank Launch -> Environment & Sustainability + Food Security & Nutrition
(8, 3),          -- Fresh Vegetable Harvest Day -> Food Security & Nutrition
(9, 1), (9, 2),   -- Compost Bin Construction -> Infrastructure & Construction + Environment & Sustainability
(10, 2), (10, 4), -- Hydroponics for Kids -> Environment & Sustainability + Education & Youth

-- UnityServe Volunteers (Projects 11 to 15)
(11, 5),         -- Community Blood Drive -> Health & Community Care
(12, 3), (12, 5), -- Food Bank Box Packing -> Food Security & Nutrition + Health & Community Care
(13, 5),         -- Senior Center Reading Day -> Health & Community Care
(14, 4), (14, 5), -- Backpack and School Supply Drive -> Education & Youth + Health & Community Care
(15, 2);         -- River Cleanup Brigade -> Environment & Sustainability

SELECT COUNT(*) AS total_categories FROM categories;
-- Result: 5 (check: >= 3)

SELECT p.project_id, p.title
FROM service_projects p
LEFT JOIN project_categories pc ON p.project_id = pc.project_id
WHERE pc.category_id IS NULL;
-- Result : (0 rows)

SELECT project_id, COUNT(category_id) AS total_categories
FROM project_categories
GROUP BY project_id
HAVING COUNT(category_id) > 1;
-- Result: show the projects 2, 3, 4, 5, 6, 7, 9, 10, 12 y 14 with 2 categories each one.

SELECT 
    p.project_id,
    p.title AS project_title,
    o.name AS organization_name,
    STRING_AGG(c.name, ', ' ORDER BY c.name) AS categories
FROM service_projects p
JOIN organization o ON p.organization_id = o.organization_id
JOIN project_categories pc ON p.project_id = pc.project_id
JOIN categories c ON pc.category_id = c.category_id
GROUP BY p.project_id, p.title, o.name
ORDER BY p.project_id;

SELECT category_id, name 
        FROM categories 
        ORDER BY name ASC;

-- create first 5 projects query


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
      LIMIT 5
	  