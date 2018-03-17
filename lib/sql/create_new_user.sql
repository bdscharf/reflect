INSERT INTO {SCHEMA}.users(
	fullname,
	username,
	password,
	last_login,
	level,
	logins,
	posts,
	goals
)
VALUES (
	$1,
	$2,
	$3,
	current_timestamp,
	$4,
	$5,
	$6,
	$7
);