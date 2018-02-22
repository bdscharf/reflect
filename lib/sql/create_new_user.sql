INSERT INTO mm_dev.users(
	fullname,
	email,
	password,
	last_login
)
VALUES (
	$1,
	$2,
	$3,
	current_timestamp
);