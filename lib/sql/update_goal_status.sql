UPDATE mm_dev.goals
SET in_progress = $1
WHERE username = $2 and created_at = $3;