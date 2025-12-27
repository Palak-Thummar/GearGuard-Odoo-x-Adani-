MERGE INTO stage (id, name, sequence, done, scrap) KEY(id) VALUES (1, 'New', 1, false, false);
MERGE INTO stage (id, name, sequence, done, scrap) KEY(id) VALUES (2, 'In Progress', 5, false, false);
MERGE INTO stage (id, name, sequence, done, scrap) KEY(id) VALUES (3, 'Repaired', 10, true, false);
MERGE INTO stage (id, name, sequence, done, scrap) KEY(id) VALUES (4, 'Scrap', 15, true, true);

-- Seed teams (idempotent)
MERGE INTO team (id, name, members) KEY(id) VALUES (1, 'Mechanical Team A', 'Alice,Bob,Charlie');
MERGE INTO team (id, name, members) KEY(id) VALUES (2, 'Electrical Team B', 'Dana,Eli,Farah');

-- Seed equipment (idempotent; references teams)
MERGE INTO equipment (id, name, serial_no, category, location, default_technician, scrapped, maintenance_team_id) KEY(id) VALUES
	(1, 'Hydraulic Pump', 'HP-1001', 'Hydraulics', 'Plant 1 - Bay A', 'Alice', false, 1),
	(2, 'Conveyor Motor', 'CM-2200', 'Electrical', 'Plant 1 - Line 3', 'Dana', false, 2),
	(3, 'Air Compressor', 'AC-3300', 'Utilities', 'Plant 2 - Utility Room', 'Charlie', false, 1);
