import { Request } from "express";

// Temporary helper functions to simplify authentication and multitenancy
// These will be replaced with proper implementation later

/**
 * Get the current user ID from the request
 * Temporarily returns a fixed ID for debugging
 */
export function getCurrentUserId(req: Request): string {
  return "1";
}

/**
 * Get the current view mode from the request
 * Temporarily returns a fixed view mode for debugging
 */
export function getCurrentViewMode(req: Request): string {
  return "escritorio";
}

/**
 * Get the current empresa ID from the request
 * Temporarily returns a fixed ID for debugging
 */
export function getCurrentEmpresaId(req: Request): number | null {
  return null; // No empresa selected by default
}

/**
 * Get the current user role
 * Temporarily returns admin role for debugging
 */
export function getCurrentUserRole(req: Request): string {
  return "admin";
}