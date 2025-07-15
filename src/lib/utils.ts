import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatInTimeZone } from 'date-fns-tz';
import { Role } from '@/types/api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('');
}

export function formatDate(
  date: string,
  format: string = 'dd/MM/yyyy',
  timeZone: string = 'UTC',
) {
  return formatInTimeZone(new Date(date), timeZone, format);
}

// function to get only the first and last word of a string
export function getFirstAndLastWord(name: string) {
  const words = name.split(' ');
  if (words.length <= 2) return name;
  return `${words[0]} ${words[words.length - 1]}`;
}

export function getRoleLabel(role: Role) {
  return role === Role.ADMINISTRATOR ? 'Administrador' : 'Usuário';
}
