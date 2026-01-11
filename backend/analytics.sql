CREATE OR REPLACE FUNCTION get_application_stats()
RETURNS jsonb AS $$
DECLARE
  result jsonb;
  daily_stats jsonb;
BEGIN
  SELECT jsonb_object_agg(day_label, count) INTO daily_stats
  FROM (
    SELECT 
      to_char(date_applied, 'Mon DD') as day_label,
      count(*) as count
    FROM applications
    WHERE user_id = auth.uid() 
      AND date_applied >= (CURRENT_DATE - INTERVAL '14 days')
    GROUP BY date_applied
    ORDER BY date_applied ASC
  ) s;

  SELECT jsonb_build_object(
    'total', count(*),
    'applied', count(*) FILTER (WHERE status = 'Applied'),
    'interviewing', count(*) FILTER (WHERE status = 'Interview'),
    'rejected', count(*) FILTER (WHERE status = 'Rejected'),
    'offers', count(*) FILTER (WHERE status = 'Offer'),
    'interview_rate', ROUND((count(*) FILTER (WHERE status IN ('Interview', 'Offer'))::numeric / NULLIF(count(*), 0)::numeric) * 100, 1),
    'weeklyData', COALESCE(daily_stats, '{}'::jsonb) 
  ) INTO result
  FROM applications
  WHERE user_id = auth.uid();

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION get_application_reminders()
RETURNS jsonb AS $$
DECLARE
  reminders_json jsonb;
BEGIN
  SELECT jsonb_agg(reminders_table) INTO reminders_json
  FROM (
    SELECT 
      *,
      -- Overdue: reminder date passed OR closing date passed
      (
        (reminder_date <= CURRENT_DATE) OR 
        (closing_date < CURRENT_DATE AND status NOT IN ('Rejected', 'Offer'))
      ) AS "isOverdue",
      
      -- Upcoming: closing date within next 7 days
      (
        closing_date >= CURRENT_DATE AND 
        closing_date <= CURRENT_DATE + INTERVAL '7 days'
      ) AS "isUpcoming"
    FROM applications
    WHERE user_id = auth.uid()
      AND (
        (reminder_date <= CURRENT_DATE) OR 
        (closing_date <= CURRENT_DATE + INTERVAL '7 days' AND status NOT IN ('Rejected', 'Offer'))
      )
    ORDER BY LEAST(reminder_date, closing_date) ASC
  ) reminders_table;

  RETURN COALESCE(reminders_json, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;