CREATE TABLE IF NOT EXISTS visits (
  id SERIAL PRIMARY KEY,
  url_id INTEGER NOT NULL REFERENCES urls(id),
  visitor_ip VARCHAR(45) NOT NULL, -- 45 characters to accommodate IPv6 addresses
  visit_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
