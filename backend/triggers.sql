CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_update_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();