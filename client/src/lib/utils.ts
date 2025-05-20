import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency values
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Format date with custom options
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', options || defaultOptions).format(dateObj);
}

// Calculate days remaining
export function daysRemaining(date: Date | string): number {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const currentDate = new Date();
  
  // Reset time part to compare only dates
  currentDate.setHours(0, 0, 0, 0);
  const targetWithoutTime = new Date(targetDate);
  targetWithoutTime.setHours(0, 0, 0, 0);
  
  const diffTime = targetWithoutTime.getTime() - currentDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Format days remaining in a human-readable way
export function formatDaysRemaining(date: Date | string): string {
  const days = daysRemaining(date);
  
  if (days < 0) {
    return `Atrasado por ${Math.abs(days)} ${Math.abs(days) === 1 ? 'dia' : 'dias'}`;
  } else if (days === 0) {
    return 'Vence hoje';
  } else {
    return `Vence em ${days} ${days === 1 ? 'dia' : 'dias'}`;
  }
}

// Get priority class based on priority value
export function getPriorityClass(priority: string): {
  bgColor: string;
  textColor: string;
  borderColor: string;
} {
  switch (priority.toLowerCase()) {
    case 'alta':
    case 'high':
    case 'urgent':
      return {
        bgColor: 'bg-red-500',
        textColor: 'text-white',
        borderColor: 'border-red-500',
      };
    case 'média':
    case 'medium':
      return {
        bgColor: 'bg-amber-500',
        textColor: 'text-white',
        borderColor: 'border-amber-500',
      };
    case 'normal':
      return {
        bgColor: 'bg-blue-500',
        textColor: 'text-white',
        borderColor: 'border-blue-500',
      };
    case 'baixa':
    case 'low':
      return {
        bgColor: 'bg-green-500',
        textColor: 'text-white',
        borderColor: 'border-green-500',
      };
    default:
      return {
        bgColor: 'bg-gray-500',
        textColor: 'text-white',
        borderColor: 'border-gray-500',
      };
  }
}

// Get icon for file type
export function getFileIcon(fileType: string): string {
  const type = fileType.toLowerCase();
  
  if (type === 'pdf') {
    return 'picture_as_pdf';
  } else if (['doc', 'docx'].includes(type)) {
    return 'description';
  } else if (['xls', 'xlsx', 'csv'].includes(type)) {
    return 'table_chart';
  } else if (type === 'xml') {
    return 'receipt';
  } else if (['jpg', 'jpeg', 'png', 'gif'].includes(type)) {
    return 'image';
  } else {
    return 'insert_drive_file';
  }
}

// Get CSS color class for file type icon
export function getFileIconClass(fileType: string): string {
  const type = fileType.toLowerCase();
  
  if (type === 'pdf') {
    return 'text-red-500 bg-red-100';
  } else if (['doc', 'docx'].includes(type)) {
    return 'text-blue-500 bg-blue-100';
  } else if (['xls', 'xlsx', 'csv'].includes(type)) {
    return 'text-green-500 bg-green-100';
  } else if (type === 'xml') {
    return 'text-amber-500 bg-amber-100';
  } else if (['jpg', 'jpeg', 'png', 'gif'].includes(type)) {
    return 'text-purple-500 bg-purple-100';
  } else {
    return 'text-gray-500 bg-gray-100';
  }
}

// Get status badge class
export function getStatusBadgeClass(status: string): {
  bgColor: string;
  textColor: string;
} {
  switch (status.toLowerCase()) {
    case 'pending':
    case 'pendente':
      return {
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-800',
      };
    case 'in_progress':
    case 'em_andamento':
      return {
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
      };
    case 'completed':
    case 'concluído':
      return {
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
      };
    case 'cancelled':
    case 'cancelado':
      return {
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
      };
    default:
      return {
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
      };
  }
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
