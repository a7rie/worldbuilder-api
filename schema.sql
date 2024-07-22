CREATE DATABASE IF NOT EXISTS worldbuilder;

USE worldbuilder;

DROP TABLE IF EXISTS `event_participation`;

DROP TABLE IF EXISTS `event`;

DROP TABLE IF EXISTS `group_characters`;

DROP TABLE IF EXISTS `Item_Ownership`;

DROP TABLE IF EXISTS `Character_Relationships`;

DROP TABLE IF EXISTS `character`;

DROP TABLE IF EXISTS `location`;

DROP TABLE IF EXISTS `item`;

DROP TABLE IF EXISTS `group_association`;

DROP TABLE IF EXISTS `group`;

DROP TABLE IF EXISTS `world`;

DROP TABLE IF EXISTS `user`;

CREATE TABLE User (
	username VARCHAR(30) NOT NULL,
	password_hash VARCHAR(72),
	date_created DATE DEFAULT (CURDATE()),
	is_admin BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (username)
);

CREATE TABLE World (
	world_id INT NOT NULL,
	world_name VARCHAR(100),
	world_description VARCHAR(100),
	username VARCHAR(30),
	PRIMARY KEY (world_id),
	FOREIGN KEY (username) REFERENCES User(username) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Location (
	location_id INT NOT NULL,
	world_id INT NOT NULL,
	location_name VARCHAR(30) NOT NULL,
	location_description VARCHAR(500),
	location_type VARCHAR(20),
	location_population INT,
	PRIMARY KEY (location_id),
	FOREIGN KEY (world_id) REFERENCES World(world_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Event (
	event_id INT NOT NULL,
	world_id INT NOT NULL,
	location_id INT,
	event_name VARCHAR(64) NOT NULL,
	event_description VARCHAR(400),
	event_type VARCHAR(24),
	event_date DATE,
	PRIMARY KEY (event_id),
	FOREIGN KEY (world_id) REFERENCES World(world_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (location_id) REFERENCES Location(location_id) ON DELETE
	SET
		NULL ON UPDATE CASCADE
);

CREATE TABLE Item (
	item_id INT NOT NULL,
	world_id INT NOT NULL,
	item_name VARCHAR(30) NOT NULL,
	item_description VARCHAR(100),
	PRIMARY KEY (item_id),
	FOREIGN KEY (world_id) REFERENCES World(world_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `Character` (
	char_id INT NOT NULL,
	world_id INT NOT NULL,
	location_id INT,
	char_name VARCHAR(30) NOT NULL,
	char_description VARCHAR(500),
	char_birth_date DATE,
	char_backstory VARCHAR(500),
	char_death_date DATE DEFAULT NULL,
	char_appearance VARCHAR(500),
	char_morality VARCHAR(30),
	PRIMARY KEY (char_id),
	FOREIGN KEY (world_id) REFERENCES World(world_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (location_id) REFERENCES Location(location_id) ON DELETE
	SET
		NULL ON UPDATE CASCADE
);

CREATE TABLE Event_Participation (
	world_id INT NOT NULL,
	char_id INT NOT NULL,
	event_id INT NOT NULL,
	PRIMARY KEY (world_id, char_id, event_id),
	FOREIGN KEY (world_id) REFERENCES World(world_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (char_id) REFERENCES `Character`(char_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `Group` (
	group_id INT NOT NULL,
	world_id INT NOT NULL,
	group_name VARCHAR(30) NOT NULL,
	group_description VARCHAR(500),
	PRIMARY KEY (group_id),
	FOREIGN KEY (world_id) REFERENCES World(world_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Group_Association (
	world_id INT NOT NULL,
	group1_id INT NOT NULL,
	group2_id INT NOT NULL,
	backstory VARCHAR(500) DEFAULT NULL,
	PRIMARY KEY (world_id, group1_id, group2_id),
	FOREIGN KEY (world_id) REFERENCES World(world_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (group1_id) REFERENCES `Group`(group_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (group2_id) REFERENCES `Group`(group_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Group_Characters (
	world_id INT NOT NULL,
	group_id INT NOT NULL,
	char_id INT NOT NULL,
	PRIMARY KEY (world_id, group_id, char_id),
	FOREIGN KEY (world_id) REFERENCES World(world_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (group_id) REFERENCES `Group`(group_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (char_id) REFERENCES `Character`(char_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Character_Relationships (
	world_id INT NOT NULL,
	char1_id INT NOT NULL,
	char2_id INT NOT NULL,
	relationship_type VARCHAR(20),
	relationship_description VARCHAR(1024),
	PRIMARY KEY (world_id, char1_id, char2_id),
	FOREIGN KEY (world_id) REFERENCES World(world_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (char1_id) REFERENCES `Character`(char_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (char2_id) REFERENCES `Character`(char_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Item_Ownership (
	world_id INT NOT NULL,
	item_id INT NOT NULL,
	char_id INT NOT NULL,
	PRIMARY KEY (world_id, item_id, char_id),
	FOREIGN KEY (world_id) REFERENCES World(world_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (item_id) REFERENCES Item(item_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (char_id) REFERENCES `Character`(char_id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO
	User (username)
VALUES
	('example_user');