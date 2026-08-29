import type { Bug } from '../types';

export function exportBugsToCSV(bugs: Bug[]) {
  if (bugs.length === 0) return;
  const headers = ['ID', 'Title', 'Product', 'Component', 'Status', 'Severity', 'Priority', 'Assignee', 'Reporter', 'Created At'];
  
  const csvRows = [];
  csvRows.push(headers.join(','));
  
  for (const bug of bugs) {
    const row = [
      bug.id,
      `"${bug.title.replace(/"/g, '""')}"`,
      `"${bug.product}"`,
      `"${bug.component}"`,
      bug.status,
      bug.severity,
      bug.priority,
      `"${bug.assignee}"`,
      `"${bug.reporter}"`,
      bug.createdAt
    ];
    csvRows.push(row.join(','));
  }
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `devtrace_bugs_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
