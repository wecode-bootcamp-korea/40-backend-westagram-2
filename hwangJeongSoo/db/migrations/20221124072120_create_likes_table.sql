-- migrate:up
CREATE TABLE
    likes (
        id INT NOT NULL,
        user_id INT NOT NULL,
        post_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (post_id) REFERENCES posts (id),
        CONSTRAINT likes_user_id_ukey UNIQUE (user_id)
        CONSTRAINT likes_post_id_ukey UNIQUE (post_id)
    );

-- migrate:down
DROP TABLE likes;