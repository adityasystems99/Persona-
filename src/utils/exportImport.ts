import { Problem, StudyDayLog } from '../types/dsa';

export const exportDataToJSON = (data: Record<string, unknown>, filename = 'algopulse-backup.json'): void => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportProblemsToCSV = (problems: Problem[]): void => {
  const headers = [
    'Title',
    'Topic',
    'Subtopic',
    'Difficulty',
    'Platform',
    'Status',
    'Time Spent (mins)',
    'Solved Independently',
    'Attempts',
    'Time Complexity',
    'Space Complexity',
    'URL',
    'Notes',
  ];

  const escapeCSV = (str: string | undefined | null) => {
    if (!str) return '""';
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = problems.map((p) => [
    escapeCSV(p.title),
    escapeCSV(p.topic),
    escapeCSV(p.subtopic || ''),
    escapeCSV(p.difficulty),
    escapeCSV(p.platform),
    escapeCSV(p.status),
    p.timeSpentMinutes,
    p.solvedIndependently ? 'Yes' : 'No',
    p.attempts,
    escapeCSV(p.timeComplexity || ''),
    escapeCSV(p.spaceComplexity || ''),
    escapeCSV(p.url),
    escapeCSV(p.notes || ''),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `algopulse-problems-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const parseImportedJSON = (jsonString: string): Record<string, unknown> | null => {
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
  } catch (err) {
    console.error('Invalid JSON file', err);
  }
  return null;
};
