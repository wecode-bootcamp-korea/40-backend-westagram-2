-- migrate:up
CREATE TABLE likes (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          post_id INT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (post_id) REFERENCES posts(id),
          CONSTRAINT like_user_id UNIQUE users(id),
          CONSTRAINT like_post_id UNIQUE posts(id)

);

-- migrate:down
DROP TABLE likes;
