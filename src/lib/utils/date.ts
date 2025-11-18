import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export function formatStoryDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    return 'Today';
  }
  
  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }
  
  return format(dateObj, 'MMMM d, yyyy');
}

export function formatStoryDateFull(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'EEEE, MMMM d, yyyy');
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function isWeekend(date: Date | string = new Date()): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const day = dateObj.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

export function getDayOfWeek(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'EEEE');
}

