INSERT INTO {SCHEMA}.user_data
(username, created_at, type, data)
VALUES
($1, current_timestamp, $2, $3);