import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

export function capitilize(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function addSpaces(str: string): string {
  return str.replace(/([A-Z])/g, ' $1').trim();
};

export function formatFieldName(str: string): string {
  return capitilize(addSpaces(str));
};

export function generateSlug(str: string): string {
  return str.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
};

/*
  If a field is marked as optional the inital ZodType is optional, and there is an innerType
  property that has the actual ZodType that we are switching which components are
  rendered. This came up when adding a checkbox switch for boolean fields.
  Didn't make sense to have these required.
*/
export function unwrapFieldType(field: z.ZodTypeAny): string {
  if (field._def.innerType) {
    return unwrapFieldType(field._def.innerType);
  }
  return field._def.typeName as string;
};
