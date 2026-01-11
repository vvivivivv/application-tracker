ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Individuals can create their own applications" 
ON applications FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Individuals can view their own applications" 
ON applications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Individuals can update their own applications" 
ON applications FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Individuals can delete their own applications" 
ON applications FOR DELETE 
USING (auth.uid() = user_id);