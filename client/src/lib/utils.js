// Utility function for conditional className merging
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
