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

SELECT 
    p.project_id,
    p.title AS project_title,
    p.proj_location,
    p.project_date,
    o.name
FROM service_projects p
JOIN organization o ON p.organization_id = o.organization_id
ORDER BY o.organization_id, p.project_date;
