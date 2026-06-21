// Configure with your machine's local IP address
// Windows: run `ipconfig` and use IPv4 Address
// Mac/Linux: run `ifconfig` and use inet address
export const API_BASE = (import.meta.env.VITE_API_URL as string) ?? 'http://192.168.1.1:3001/api/v1';
export const WEB_BASE = (import.meta.env.VITE_WEB_URL as string) ?? `http://${window.location.hostname}:3000`;

export const STORAGE_KEY = 'pint_auth';
