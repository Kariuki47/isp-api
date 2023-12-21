USE radius;

DELIMITER $$
USE `radius`$$

CREATE PROCEDURE `userDisable` (
  IN _username VARCHAR(64),
  IN _groupname VARCHAR(64),
  IN _priority INT(11)
)
BEGIN 
    INSERT INTO radusergroup (username, groupname, priority)
    VALUES (_username, _groupname, _priority);
END