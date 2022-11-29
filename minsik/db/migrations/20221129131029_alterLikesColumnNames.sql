-- migrate:up
ALTER TABLE likes
    RENAME COLUMN likes_user to user_id,
    RENAME COLUMN likes_post to post_id;

-- migrate:down

