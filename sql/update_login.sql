UPDATE mm_dev.users
SET last_login = current_timestamp
WHERE user_id = $1;