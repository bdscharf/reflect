UPDATE {SCHEMA}.users
SET level = $1
WHERE username = $2;