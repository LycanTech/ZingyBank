import { format, parseISO } from 'date-fns';

export function formatDate(isoString: string): string {
  const date = parseISO(isoString);
  return format(date, 'MMM d, yyyy');
}

export function formatDateTime(isoString: string): string {
  const date = parseISO(isoString);
  return format(date, 'MMM d, yyyy h:mm a');
}
