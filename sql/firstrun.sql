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
	firstname VARCHAR,
	lastname VARCHAR,
	email VARCHAR,
	password VARCHAR,
	last_login timestamp without time zone,
	CONSTRAINT uniq_email UNIQUE (email)
);

CREATE TABLE {SCHEMA}.user_data(
	user_id INT NOT NULL,
	created_at timestamp with time zone,
	data JSONB
);