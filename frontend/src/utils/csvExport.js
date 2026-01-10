/**
 * Utility to escape special characters for CSV compatibility, 
 * which wraps fields in double quotes and escapes existing double quotes.
 */
const escapeCSV = (field) => {
  if (field === null || field === undefined) return '""';
  
  let stringValue = Array.isArray(field) ? field.join('; ') : String(field);
  const escaped = stringValue.replace(/"/g, '""');
  return `"${escaped}"`;
};

export const exportToCSV = (jobs) => {
  if (!jobs || jobs.length === 0) {
    return alert("No data to export!");
  }

  const headers = [
    "Company",
    "Job Title",
    "Status",
    "Date Applied",
    "Closing Date",
    "Interview Date",
    "Tags",
    "Job URL",
    "Job Description",
    "Notes",
    "Created At",
    "Updated At"
  ];

  const csvRows = jobs.map(j => {
    return [
      escapeCSV(j.company),
      escapeCSV(j.job_title),
      escapeCSV(j.status),
      escapeCSV(j.date_applied),
      escapeCSV(j.closing_date),
      escapeCSV(j.interview_date),
      escapeCSV(j.tags),
      escapeCSV(j.job_url),
      escapeCSV(j.job_description),
      escapeCSV(j.notes),
      escapeCSV(j.created_at),
      escapeCSV(j.updated_at)
    ].join(",");
  });

  const csvString = [headers.join(","), ...csvRows].join("\n");

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `job_applications_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};