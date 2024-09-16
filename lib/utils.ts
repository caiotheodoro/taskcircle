import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGuestEmail(name: string) {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}@guest.com`;
}

export function getInitials(name: string) {
  const words = name.toUpperCase().trim().split(' ');
  if (words.length === 1) {
    const word = words[0];
    return word.length > 1 ? `${word[0]}${word[word.length - 1]}` : word[0];
  }
  return words.map((n) => n[0]).join('');
}

export const getTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months}mo`;
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;

  if (minutes === 0) return 'just now';
  return `${minutes}m`;
};

export const getDate = (date: Date) => {
  const time = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const day = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  return `${time}, ${day}`;
};
