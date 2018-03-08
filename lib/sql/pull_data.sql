SELECT * FROM {SCHEMA}.user_data
WHERE username = $1 AND type = $2;