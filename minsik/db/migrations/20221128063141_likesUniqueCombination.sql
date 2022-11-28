-- migrate:up
ALTER TABLE likes
    ADD CONSTRAINT likesUniqueCombination UNIQUE(likes_user, likes_post)

-- migrate:down

