const API_BASE = 'https://inai-col1.fishrungames.com';

export const API = {
  ADS: `${API_BASE}/ads`,
  imageUrl: (path: string) => `${API_BASE}${path}`,
};
