-- the percentage of all users who signed up using their Facebook account.
-- number of users signed up with facebook account / number of users
WITH signups AS (
	SELECT
		COUNT(
			DISTINCT(
				CASE
					WHEN a.platform = 'facebook' THEN a.user_id
				END
			)
		) AS facebook_users,
		COUNT(DISTINCT(a.user_id)) AS unique_users
	FROM
		accounts a
		LEFT JOIN accounts b ON a.user_id = b.user_id
		AND b.created_at < a.created_at
	WHERE
		b.created_at IS NULL
)
SELECT
	TRUNC(100 * facebook_users / unique_users :: float) AS percentage
FROM
	signups -- Do the same with ROW_NUMBER() window function 
	WITH numbered_acc AS (
		SELECT
			*,
			ROW_NUMBER() OVER (
				PARTITION BY user_id
				ORDER BY
					created_at
			) AS account_num
		FROM
			accounts
	)
SELECT
	COUNT(DISTINCT(user_id)) AS unique_users,
	COUNT(
		CASE
			WHEN platform = 'facebook' THEN id
		END
	) AS facebook_users,
	COUNT(
		CASE
			WHEN platform = 'facebook' THEN id
		END
	) / COUNT(DISTINCT(user_id)) :: float AS percent
FROM
	numbered_acc
WHERE
	account_num = 1