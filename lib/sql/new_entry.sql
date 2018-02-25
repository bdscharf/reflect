INSERT INTO mm_dev.userdata
(username, created_at, type, data)
VALUES
($1, current_timestamp, $2, $3);