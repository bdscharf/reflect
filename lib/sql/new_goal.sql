INSERT INTO mm_dev.goals
(username, created_at, duration, in_progress, goal)
VALUES
($1, current_timestamp, $2, $3, $4);