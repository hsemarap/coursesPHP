CREATE trigger facDelete AFTER DELETE ON departments FOR each ROW DELETE FROM faculties WHERE department_id = OLD.id;
