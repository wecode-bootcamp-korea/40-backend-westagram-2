-- migrate:up
CREATE TABLE
    likes (
        id INT NOT NULL,
        user_id INT NOT NULL,
        post_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (post_id) REFERENCES posts (id),
        UNIQUE (user_id)
    );

-- migrate:down
DROP TABLE likes;