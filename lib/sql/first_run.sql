DROP SCHEMA IF EXISTS mm_dev CASCADE;
CREATE SCHEMA mm_dev;

CREATE SEQUENCE mm_dev.user_id
	INCREMENT 1
	MINVALUE 1
    MAXVALUE 10000
    START 1
    CACHE 1;

CREATE TABLE mm_dev.users(
	user_id INT NOT NULL DEFAULT nextval('mm_dev.user_id'::regclass),
	fullname VARCHAR,
	username VARCHAR,
	password VARCHAR,
	last_login timestamp without time zone,
	CONSTRAINT uniq_username UNIQUE (username)
);

CREATE TABLE mm_dev.user_data(
	username VARCHAR NOT NULL,
	created_at timestamp with time zone,
	type VARCHAR,
	data JSONB
);

CREATE TABLE mm_dev.goals(
	username VARCHAR NOT NULL,
	created_at timestamp with time zone,
	duration VARCHAR,
	in_progress boolean,
	goal VARCHAR
);