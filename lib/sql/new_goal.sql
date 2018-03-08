INSERT INTO {SCHEMA}.goals
(username, created_at, duration, in_progress, goal, reward)
VALUES
($1, $2, $3, $4, $5, $6);