UPDATE {SCHEMA}.users
SET last_login = current_timestamp
WHERE username = $1;