CREATE TABLE IF NOT EXISTS applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid(),
    job_title text NOT NULL,
    company text NOT NULL,
    job_url text,
    job_description text,
    notes text,
    status text DEFAULT 'Applied',
    date_applied date DEFAULT current_date,
    closing_date date,
    interview_date date,
    reminder_date date,
    tags jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
);

