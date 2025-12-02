export function encodeId(id: string): string {
  return btoa(id).replace(/=/g, '');
}

export function decodeId(encoded: string): string {
  return atob(encoded);
}
