INSERT INTO {SCHEMA}.users(
	fullname,
	username,
	password,
	last_login
)
VALUES (
	$1,
	$2,
	$3,
	current_timestamp
);