CREATE trigger facDelete AFTER DELETE ON departments 
FOR each ROW
DELETE FROM faculties WHERE department_id = OLD.id;

DELIMITER $
CREATE PROCEDURE facultyTermid(IN termid INT(11))
BEGIN
SELECT * from users as u,term_faculties as tf,faculties as f where tf.term_id = termid and tf.faculty_id = f.id and f.user_id = u.id;
END $
DELIMITER ;
