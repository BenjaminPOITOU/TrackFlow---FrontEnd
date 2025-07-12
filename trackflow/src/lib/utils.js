/**
 * @file lib/utils.js (or .ts)
 * @description Provides core utility functions for the application, including a helper for managing CSS class names.
 */

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";


/**
 * A utility function to conditionally join and merge Tailwind CSS classes.
 *
 * This function is a composition of two utilities:
 * 1.  `clsx`: Handles the conditional logic, allowing you to build class strings
 *     from strings, objects, and arrays.
 * 2.  `tailwind-merge`: Intelligently merges the resulting class string, resolving
 *     conflicts in Tailwind classes in a predictable way (e.g., `p-2` and `p-4` becomes just `p-4`).
 *
 * This is the standard utility for creating reusable and overridable components with Tailwind CSS.
 *
 * @param {...any} inputs - A list of class values to be processed by `clsx`. This can include strings, objects with boolean keys, and arrays.
 * @returns {string} A single, clean, and de-duplicated class name string.
 * @see https://github.com/lukeed/clsx
 * @see https://github.com/dcastil/tailwind-merge
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
