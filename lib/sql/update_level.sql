UPDATE {SCHEMA}.users
SET level = $1, logins = $2, posts = $3, goals = $4
WHERE username = $5;