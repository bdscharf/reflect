UPDATE mm_dev.users
SET last_login = current_timestamp
WHERE username = $1;