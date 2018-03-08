DROP SCHEMA IF EXISTS {SCHEMA} CASCADE;
CREATE SCHEMA {SCHEMA};

CREATE SEQUENCE {SCHEMA}.user_id
	INCREMENT 1
	MINVALUE 1
    MAXVALUE 10000
    START 1
    CACHE 1;

CREATE TABLE {SCHEMA}.users(
	user_id INT NOT NULL DEFAULT nextval('{SCHEMA}.user_id'::regclass),
	fullname VARCHAR,
	username VARCHAR,
	password VARCHAR,
	last_login timestamp without time zone,
	CONSTRAINT uniq_username UNIQUE (username)
);

CREATE TABLE {SCHEMA}.user_data(
	username VARCHAR NOT NULL,
	created_at timestamp with time zone,
	type VARCHAR,
	data JSONB
);

CREATE TABLE {SCHEMA}.goals(
	username VARCHAR NOT NULL,
	created_at VARCHAR,
	duration VARCHAR,
	in_progress boolean,
	goal VARCHAR,
	reward VARCHAR
);