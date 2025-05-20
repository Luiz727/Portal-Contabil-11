import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes condicionalmente com suporte ao Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata um número como moeda brasileira (R$)
 * @param value - Valor a ser formatado
 * @returns String formatada em Real brasileiro
 */
export function formatCurrency(value: number | string): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue || 0);
}

/**
 * Formata uma data ISO para o formato brasileiro (DD/MM/YYYY)
 * @param isoDate - Data em formato ISO
 * @returns String formatada em padrão brasileiro
 */
export function formatDate(isoDate: string): string {
  if (!isoDate) return '';
  
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

/**
 * Formata um número com o símbolo de percentual
 * @param value - Valor a ser formatado
 * @returns String formatada com símbolo de percentual
 */
export function formatPercent(value: number | string): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue / 100);
}