INSERT INTO {SCHEMA}.users(
	firstname,
	lastname,
	email,
	password,
	last_login
)
VALUES (
	$1,
	$2,
	$3,
	$4,
	timestamp
);